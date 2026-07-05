"""
tests/test_health.py
-----------------------
Smoke test proving the FastAPI application boots and the /health
endpoint responds correctly.

Why this file exists:
    Even at the pure-scaffolding stage, we want an automated test that
    proves the whole wiring (main.py -> api/v1/router.py ->
    api/v1/health.py -> schemas/health.py) actually works together, not
    just that individual files parse.

Run with:
    pytest
"""

from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_health_check_returns_200():
    response = client.get("/api/v1/health")
    assert response.status_code == 200


def test_health_check_response_shape():
    response = client.get("/api/v1/health")
    body = response.json()

    assert body["status"] == "ok"
    assert "app_name" in body
    assert "version" in body
    assert "environment" in body
