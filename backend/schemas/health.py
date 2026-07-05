"""
schemas/health.py
--------------------
Pydantic schemas (request/response models) related to health checks.

Why this file exists:
    The `schemas/` package holds Pydantic models that define the shape of
    data crossing the API boundary (request bodies and response payloads).
    Keeping schemas separate from route handlers (api/) and from internal
    domain models (models/) is a core clean-architecture practice:
    it lets the external API contract evolve independently of internal
    representations.

Where this fits in the architecture:
    Used by api/v1/health.py to define exactly what the `/health`
    endpoint returns, so FastAPI can validate and auto-document the
    response shape in the OpenAPI docs.
"""

from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    """Response payload returned by the /health endpoint."""

    status: str = Field(..., examples=["ok"], description="Overall service status")
    app_name: str = Field(..., description="Name of the running application")
    version: str = Field(..., description="Current application version")
    environment: str = Field(..., description="Environment the app is running in")
