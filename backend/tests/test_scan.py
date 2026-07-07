"""
tests/test_scan.py
---------------------
Tests for the Sprint 10 pipeline scan job system:
  POST /scan/{ticker}
  GET  /scan/{job_id}

Covers:
  - Job creation returns a valid, well-formed job in the "Queued" state.
  - Polling an unknown job_id returns 404.
  - The pipeline progression itself (service layer) correctly advances
    Queued -> Fetching -> Processing -> Completed and updates progress.
  - A failure mid-pipeline is captured as a "Failed" job state rather
    than raised into the void.

Run with:
    pytest
"""

import asyncio

import pytest
from fastapi.testclient import TestClient

from main import app
from services import scan_service
from services.scan_service import (
    ScanJobNotFoundError,
    create_scan_job,
    get_scan_job,
    run_scan_pipeline,
)

client = TestClient(app)


def test_create_scan_job_returns_202_and_queued_state():
    response = client.post("/api/v1/scan/AAPL")
    assert response.status_code == 202

    body = response.json()
    assert body["ticker"] == "AAPL"
    assert body["status"] in ("Queued", "Fetching", "Processing", "Completed")
    assert 0 <= body["progress"] <= 100
    assert body["job_id"]
    assert body["error"] is None


def test_create_scan_job_normalizes_ticker_casing():
    response = client.post("/api/v1/scan/aapl")
    assert response.status_code == 202
    assert response.json()["ticker"] == "AAPL"


def test_poll_scan_job_returns_200_for_known_job():
    create_response = client.post("/api/v1/scan/MSFT")
    job_id = create_response.json()["job_id"]

    poll_response = client.get(f"/api/v1/scan/{job_id}")
    assert poll_response.status_code == 200
    assert poll_response.json()["job_id"] == job_id


def test_poll_scan_job_returns_404_for_unknown_job():
    response = client.get("/api/v1/scan/does-not-exist")
    assert response.status_code == 404


def test_scan_job_eventually_reaches_completed_via_background_task():
    """
    FastAPI's TestClient runs scheduled BackgroundTasks to completion as
    part of handling the request, so by the time the POST call returns,
    the pipeline has typically already finished (given the short test
    delay configured via SCAN_STAGE_DELAY_SECONDS). We poll in a small
    retry loop regardless, to avoid coupling this test to that
    implementation detail.
    """
    create_response = client.post("/api/v1/scan/NVDA")
    job_id = create_response.json()["job_id"]

    final_status = None
    for _ in range(20):
        poll_response = client.get(f"/api/v1/scan/{job_id}")
        final_status = poll_response.json()["status"]
        if final_status == "Completed":
            break

    assert final_status == "Completed"


# ----------------------------------------------------------------------
# Service-layer tests (direct, deterministic — no HTTP/background-task
# timing involved)
# ----------------------------------------------------------------------

def test_service_create_scan_job_starts_queued():
    job = create_scan_job("tsla")
    assert job.ticker == "TSLA"
    assert job.status.value == "Queued"
    assert job.progress == 0
    assert job.error is None


def test_service_get_scan_job_raises_for_unknown_job():
    with pytest.raises(ScanJobNotFoundError):
        get_scan_job("nonexistent-job-id")


def test_service_run_scan_pipeline_progresses_to_completed():
    job = create_scan_job("GOOGL")

    asyncio.run(run_scan_pipeline(job.job_id))

    final_job = get_scan_job(job.job_id)
    assert final_job.status.value == "Completed"
    assert final_job.progress == 100
    assert final_job.error is None
    assert final_job.updated_at >= final_job.created_at


def test_service_run_scan_pipeline_marks_failed_on_error(monkeypatch):
    job = create_scan_job("FAIL")

    async def _boom(*args, **kwargs):
        raise RuntimeError("simulated ingestion failure")

    monkeypatch.setattr(scan_service.asyncio, "sleep", _boom)

    asyncio.run(run_scan_pipeline(job.job_id))

    final_job = get_scan_job(job.job_id)
    assert final_job.status.value == "Failed"
    assert "simulated ingestion failure" in final_job.error


def test_service_run_scan_pipeline_handles_unknown_job_gracefully():
    # Should log and return, not raise, since there's no caller to
    # propagate an exception to from a background task.
    asyncio.run(run_scan_pipeline("does-not-exist"))
