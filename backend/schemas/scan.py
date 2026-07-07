"""
schemas/scan.py
------------------
Pydantic schemas (request/response models) related to pipeline scan jobs.

Why this file exists:
    The `schemas/` package holds Pydantic models that define the shape of
    data crossing the API boundary. A scan job is its own resource —
    distinct from company data — so it gets its own schema module rather
    than being folded into schemas/company.py.

Where this fits in the architecture:
    Used by api/v1/scan.py to define exactly what the scan job
    create/poll endpoints return, so FastAPI can validate and
    auto-document the response shape in the OpenAPI docs.

Status (Sprint 10 - Pipeline Scan System):
    Backed by an IN-MEMORY job store (see services/scan_service.py).
    No persistence, queueing system, or distributed worker exists yet —
    a single process's memory is the source of truth. That's an
    explicit, temporary scope decision for this sprint; swapping in a
    real queue/worker (e.g. Celery + Redis) later should not require
    changing this response shape.
"""

from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Field


class ScanStatus(str, Enum):
    """
    Lifecycle states of a pipeline scan job.

    Modeled as a str Enum so FastAPI/Pydantic serialize it as a plain
    JSON string (e.g. "Queued") rather than an integer or nested object,
    keeping the API contract simple for frontend consumers.
    """

    QUEUED = "Queued"
    FETCHING = "Fetching"
    PROCESSING = "Processing"
    COMPLETED = "Completed"
    FAILED = "Failed"


class ScanJobResponse(BaseModel):
    """
    Response payload returned by both the job-creation and job-polling
    endpoints (POST /scan/{ticker} and GET /scan/{job_id}). Using the
    same shape for both keeps the contract simple: creating a job just
    returns its initial state, which looks exactly like every
    subsequent poll response.
    """

    job_id: str = Field(
        ..., examples=["3fa85f64-5717-4562-b3fc-2c963f66afa6"],
        description="Unique identifier for this scan job",
    )
    ticker: str = Field(..., examples=["AAPL"], description="Ticker this scan job is processing")
    status: ScanStatus = Field(..., description="Current lifecycle stage of the scan job")
    progress: int = Field(
        ..., ge=0, le=100, examples=[65], description="Approximate completion percentage, 0-100"
    )
    created_at: datetime = Field(..., description="UTC timestamp when the job was created")
    updated_at: datetime = Field(..., description="UTC timestamp of the job's last status change")
    error: str | None = Field(
        default=None, description="Error message if the job failed; null otherwise"
    )
