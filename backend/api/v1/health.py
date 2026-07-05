"""
api/v1/health.py
-------------------
Health check endpoint router.

Why this file exists:
    Every production backend needs a lightweight, dependency-free endpoint
    that load balancers, container orchestrators (Kubernetes liveness /
    readiness probes), and uptime monitors can call to verify the service
    process is alive and responding.

Design notes:
    - This endpoint intentionally does NOT check downstream dependencies
      (database, cache, external APIs) yet, since none exist in this
      scaffolding stage. When those are added later, this is the natural
      place to extend the check (e.g. verifying DB connectivity) — most
      likely by splitting into /health/live and /health/ready.
    - Uses `APIRouter` so it can be mounted independently and versioned
      cleanly under /api/v1.

Where this fits in the architecture:
    Registered in api/v1/router.py, which aggregates all v1 routers and
    is itself included in main.py under the configured API prefix.
"""

from fastapi import APIRouter

from core.config import settings
from core.logging_config import get_logger
from schemas.health import HealthResponse

logger = get_logger(__name__)

router = APIRouter(tags=["Health"])


@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Health check",
    description="Returns basic service health and metadata. Used by load "
    "balancers, orchestrators, and uptime monitors.",
)
async def health_check() -> HealthResponse:
    """
    Simple liveness check.

    Returns HTTP 200 with basic app metadata as long as the process is
    running and able to handle requests.
    """
    logger.debug("Health check requested")
    return HealthResponse(
        status="ok",
        app_name=settings.APP_NAME,
        version=settings.APP_VERSION,
        environment=settings.ENVIRONMENT,
    )
