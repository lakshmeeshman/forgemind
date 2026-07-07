"""
services/scan_service.py
---------------------------
Business logic layer for pipeline scan jobs.

Why this file exists:
    Route handlers in api/ should stay thin: parse the request, call a
    service function, return the response. Job creation, status
    tracking, and the simulated pipeline progression itself all belong
    here rather than in the route handler.

Status (Sprint 10 - Pipeline Scan System):
    Uses a simple in-memory dict (`_SCAN_JOBS`) as the job store. This
    is intentionally the simplest thing that could work for this
    sprint:
      - No persistence: jobs are lost on process restart.
      - No cross-process sharing: won't work correctly behind multiple
        uvicorn workers/replicas, since each process has its own store.
      - No expiry/cleanup: completed jobs stay in memory indefinitely.
    All three are acceptable, explicit trade-offs for now. Swapping in
    a real store (Redis, a database table, or a proper task queue like
    Celery/RQ) later should only require changing this file — the
    public function signatures and `ScanJobResponse` schema are
    designed to stay stable across that change.

Design notes:
    - Ticker validity is intentionally NOT checked against the live
      company service here — a scan job can be created for any
      ticker-shaped string. Pipeline scans are meant to simulate an
      ingestion crawl, and validating against Yahoo Finance would tie
      job creation to an external network call, adding latency and a
      new failure mode out of scope for this sprint.
    - The actual stage progression (`run_scan_pipeline`) is written as
      a plain async function so the route layer can hand it to
      FastAPI's `BackgroundTasks` unchanged — this file has no
      dependency on FastAPI itself, keeping the service layer
      framework-agnostic.

Where this fits in the architecture:
    Called by api/v1/scan.py. Raises `ScanJobNotFoundError` for unknown
    job IDs; the route layer is responsible for translating that into
    the appropriate HTTP response.
"""

import asyncio
import uuid
from datetime import datetime, timezone

from core.config import settings
from core.logging_config import get_logger
from schemas.scan import ScanJobResponse, ScanStatus

logger = get_logger(__name__)


class ScanJobNotFoundError(Exception):
    """
    Raised when no scan job exists for a given job ID.

    Kept as a plain domain-level exception (rather than raising an
    HTTPException directly from the service layer) so that the service
    layer stays framework-agnostic and reusable outside of an HTTP
    context (e.g. from a background worker in the future).
    """

    def __init__(self, job_id: str):
        self.job_id = job_id
        super().__init__(f"No scan job found for job_id '{job_id}'")


# ----------------------------------------------------------------------
# In-memory job store
# ----------------------------------------------------------------------
# Keyed by job_id. See the module docstring above for the scope and
# limitations of this approach.
_SCAN_JOBS: dict[str, ScanJobResponse] = {}

# Ordered pipeline stages, paired with the progress percentage reached
# once that stage completes. COMPLETED is handled separately below
# since it's the terminal state rather than an intermediate one.
_PIPELINE_STAGES: list[tuple[ScanStatus, int]] = [
    (ScanStatus.FETCHING, 35),
    (ScanStatus.PROCESSING, 75),
]


def _touch(job: ScanJobResponse, **updates) -> ScanJobResponse:
    """
    Returns a copy of `job` with the given fields updated and
    `updated_at` refreshed to now, and persists it back into the store.

    Pydantic models are immutable-by-convention in this codebase (we
    always construct a new instance rather than mutating fields in
    place), so this small helper centralizes the "update + re-stamp +
    save" pattern used throughout the pipeline progression below.
    """
    updated_job = job.model_copy(update={**updates, "updated_at": datetime.now(timezone.utc)})
    _SCAN_JOBS[updated_job.job_id] = updated_job
    return updated_job


def create_scan_job(ticker: str) -> ScanJobResponse:
    """
    Creates a new pipeline scan job in the "Queued" state.

    Args:
        ticker: Stock ticker symbol, case-insensitive (e.g. "aapl" or
            "AAPL"). Not validated against live company data — see the
            module docstring for why.

    Returns:
        ScanJobResponse: The newly created job, with status "Queued"
            and progress 0. Callers are responsible for scheduling
            `run_scan_pipeline(job_id)` (e.g. via FastAPI's
            `BackgroundTasks`) to actually advance it.
    """
    normalized_ticker = ticker.strip().upper()
    now = datetime.now(timezone.utc)

    job = ScanJobResponse(
        job_id=str(uuid.uuid4()),
        ticker=normalized_ticker,
        status=ScanStatus.QUEUED,
        progress=0,
        created_at=now,
        updated_at=now,
        error=None,
    )
    _SCAN_JOBS[job.job_id] = job

    logger.info(f"Scan job created: job_id={job.job_id} ticker={normalized_ticker}")
    return job


def get_scan_job(job_id: str) -> ScanJobResponse:
    """
    Look up the current state of a scan job by ID.

    Args:
        job_id: The job's unique identifier, as returned by
            `create_scan_job()`.

    Returns:
        ScanJobResponse: The job's current status and progress.

    Raises:
        ScanJobNotFoundError: If no job exists for the given job_id.
    """
    job = _SCAN_JOBS.get(job_id)
    if job is None:
        logger.warning(f"Scan job lookup failed — unknown job_id: {job_id}")
        raise ScanJobNotFoundError(job_id)

    return job


async def run_scan_pipeline(job_id: str) -> None:
    """
    Advances a scan job through its full lifecycle:
    Queued -> Fetching -> Processing -> Completed.

    Intended to be scheduled as a background task immediately after
    `create_scan_job()` (see api/v1/scan.py), so the creating request
    can return the job ID right away without blocking on the full
    pipeline duration.

    Each stage transition is separated by `settings.SCAN_STAGE_DELAY_SECONDS`
    to simulate real ingestion work. If anything goes wrong mid-pipeline,
    the job is marked "Failed" with the error message attached rather
    than left stuck in an intermediate state.

    Args:
        job_id: The job's unique identifier.
    """
    job = _SCAN_JOBS.get(job_id)
    if job is None:
        # Defensive: shouldn't happen in practice since the route only
        # schedules this immediately after create_scan_job() succeeds,
        # but a background task has no caller to report an exception
        # to, so we log loudly instead of raising into the void.
        logger.error(f"Cannot run pipeline — unknown job_id: {job_id}")
        return

    try:
        for stage_status, stage_progress in _PIPELINE_STAGES:
            await asyncio.sleep(settings.SCAN_STAGE_DELAY_SECONDS)
            job = _touch(job, status=stage_status, progress=stage_progress)
            logger.debug(
                f"Scan job {job_id} ({job.ticker}) advanced to "
                f"{stage_status.value} ({stage_progress}%)"
            )

        await asyncio.sleep(settings.SCAN_STAGE_DELAY_SECONDS)
        job = _touch(job, status=ScanStatus.COMPLETED, progress=100)
        logger.info(f"Scan job completed: job_id={job_id} ticker={job.ticker}")

    except Exception as exc:
        # Broad catch is intentional: this runs as a background task
        # with no caller to propagate exceptions to. Any failure here
        # must be captured in the job's own state (so pollers see it)
        # and logged (so operators see it) rather than silently
        # crashing an orphaned asyncio task.
        logger.error(f"Scan job {job_id} failed: {exc}", exc_info=True)
        _touch(job, status=ScanStatus.FAILED, progress=job.progress, error=str(exc))
