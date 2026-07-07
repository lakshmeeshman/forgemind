"""
api/v1/scan.py
-----------------
Pipeline scan job endpoint router.

Why this file exists:
    Exposes the pipeline scan system to API consumers: creating a scan
    job for a ticker and polling its status until it reaches a
    terminal state (Completed/Failed).

Design notes:
    - The route handler ONLY parses the request, delegates to
      `services/scan_service.py`, and shapes the HTTP response. All job
      lifecycle logic (state machine, in-memory storage, the simulated
      pipeline itself) lives in the service layer.
    - Job creation returns immediately with the job in its "Queued"
      state; the actual Fetching -> Processing -> Completed progression
      runs via FastAPI's `BackgroundTasks`, scheduled right after the
      job is created. This lets the endpoint respond instantly (as a
      "Run Pipeline Scan" button click should) while the simulated work
      continues after the response is sent.

Status (Sprint 10 - Pipeline Scan System):
    Backed by an IN-MEMORY job store (see services/scan_service.py) —
    no persistence or distributed queue yet. See that module's
    docstring for the full scope and trade-offs.

Where this fits in the architecture:
    Registered in api/v1/router.py, which aggregates all v1 routers and
    is itself included in main.py under the configured API prefix.
"""

from fastapi import APIRouter, BackgroundTasks, HTTPException, status

from core.logging_config import get_logger
from schemas.scan import ScanJobResponse
from services.scan_service import (
    ScanJobNotFoundError,
    create_scan_job,
    get_scan_job,
    run_scan_pipeline,
)

logger = get_logger(__name__)

router = APIRouter(tags=["Scan"])


@router.post(
    "/scan/{ticker}",
    response_model=ScanJobResponse,
    status_code=status.HTTP_202_ACCEPTED,
    summary="Create a pipeline scan job",
    description="Creates a new pipeline scan job for the given ticker and "
    "schedules it to run in the background. Returns immediately with the "
    "job's initial ('Queued') state — poll GET /scan/{job_id} for progress.",
)
async def create_scan_job_endpoint(
    ticker: str, background_tasks: BackgroundTasks
) -> ScanJobResponse:
    """
    Create and kick off a new pipeline scan job.

    Args:
        ticker: Stock ticker symbol, case-insensitive (e.g. "AAPL").
        background_tasks: Injected by FastAPI; used to schedule the
            simulated pipeline progression after the response is sent.

    Returns:
        ScanJobResponse: The newly created job (status "Queued",
            progress 0).
    """
    logger.debug(f"Scan job requested for ticker: {ticker}")

    job = create_scan_job(ticker)
    background_tasks.add_task(run_scan_pipeline, job.job_id)

    return job


@router.get(
    "/scan/{job_id}",
    response_model=ScanJobResponse,
    summary="Poll a pipeline scan job's status",
    description="Returns the current status and progress of a previously "
    "created scan job.",
)
async def get_scan_job_endpoint(job_id: str) -> ScanJobResponse:
    """
    Retrieve the current state of a scan job.

    Args:
        job_id: The job's unique identifier, as returned by
            POST /scan/{ticker}.

    Returns:
        ScanJobResponse: The job's current status and progress.

    Raises:
        HTTPException: 404 if no job exists for the given job_id.
    """
    logger.debug(f"Scan job status requested for job_id: {job_id}")

    try:
        return get_scan_job(job_id)
    except ScanJobNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Scan job not found for job_id '{job_id}'",
        ) from exc
