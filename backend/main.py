"""
main.py
--------
Application entrypoint. Creates and configures the FastAPI instance.

Why this file exists:
    This is the single place where the FastAPI `app` object is
    constructed and wired together: settings, logging, middleware
    (CORS), lifecycle events, and versioned API routers. Keeping this
    file thin and purely "wiring" (no business logic, no route logic)
    is a core clean-architecture practice — it should be easy to read
    top-to-bottom and understand the whole app's shape.

Run locally with:
    uvicorn main:app --reload --host 0.0.0.0 --port 8000

Where this fits in the architecture:
    main.py sits at the very top of the dependency graph. It imports
    from core/ and api/, but nothing imports from main.py itself
    (this avoids circular imports and keeps main.py replaceable).
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.v1.router import api_router
from core.config import settings
from core.events import lifespan
from core.logging_config import configure_logging, get_logger

# Configure logging BEFORE anything else runs, so that even startup
# events (in core/events.py) log using the correct format/level.
configure_logging()
logger = get_logger(__name__)


def create_app() -> FastAPI:
    """
    Application factory.

    Using a factory function (rather than instantiating `FastAPI()` at
    module import time with everything inline) makes the app easier to
    test — e.g. tests or scripts can call `create_app()` to get a fresh,
    fully-configured instance if ever needed.
    """
    app = FastAPI(
        title=settings.APP_NAME,
        description=settings.APP_DESCRIPTION,
        version=settings.APP_VERSION,
        lifespan=lifespan,
        # Hide interactive docs in production if desired. Left enabled
        # here since no sensitive endpoints exist yet at this scaffolding
        # stage.
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/openapi.json",
    )

    # ------------------------------------------------------------------
    # CORS configuration
    # ------------------------------------------------------------------
    # Allows configured frontend origins to call this API from the
    # browser. Origins are environment-driven (see core/settings.py ->
    # BACKEND_CORS_ORIGINS) rather than hardcoded, so different origins
    # can be allowed per environment (local/dev/staging/prod).
    if settings.cors_origins:
        app.add_middleware(
            CORSMiddleware,
            allow_origins=settings.cors_origins,
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )
    else:
        logger.warning(
            "BACKEND_CORS_ORIGINS is empty — no CORS origins are allowed. "
            "Set this in your .env file for frontend integration."
        )

    # ------------------------------------------------------------------
    # Routers
    # ------------------------------------------------------------------
    # All versioned API routes are mounted under settings.API_V1_PREFIX
    # (default "/api/v1"). See api/v1/router.py for what's included.
    app.include_router(api_router, prefix=settings.API_V1_PREFIX)

    return app


app = create_app()
