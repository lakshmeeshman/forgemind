"""
core/events.py
----------------
Application lifecycle event handlers (startup / shutdown).

Why this file exists:
    Keeping startup/shutdown logic inline in main.py becomes messy as an
    application grows (DB connections, cache warmup, background workers,
    AI/ML model loading, etc. will all eventually need init/teardown
    hooks). This module centralizes that logic so main.py stays thin.

Design notes:
    - Uses FastAPI's modern `lifespan` context-manager style (the
      recommended replacement for the older `@app.on_event("startup")`
      decorators, which are deprecated).
    - Currently only logs lifecycle events, since no database, cache, or
      AI/ML resources have been wired up yet. This is intentional — this
      stage of the project only scaffolds the foundation. Future stages
      will add real resource initialization here (e.g. opening a DB
      connection pool, loading ML models, connecting to a message queue).

Where this fits in the architecture:
    main.py passes `lifespan` into the `FastAPI(...)` constructor. This
    is the ONLY place startup/shutdown behavior should be defined.
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI

from core.settings import get_settings
from core.logging_config import get_logger

logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    FastAPI lifespan context manager.

    Everything before `yield` runs on application startup.
    Everything after `yield` runs on application shutdown.

    Future additions (NOT implemented yet, per project scope):
        - Initialize database connection pool
        - Warm up caches
        - Load ML models into memory
        - Connect to message brokers / task queues
        - Register health-check dependencies
    """
    settings = get_settings()

    # ---------------------- STARTUP ----------------------
    logger.info(f"Starting {settings.APP_NAME} v{settings.APP_VERSION}")
    logger.info(f"Environment: {settings.ENVIRONMENT}")
    logger.info("Startup complete. Application is ready to accept requests.")

    yield  # <-- application runs while suspended here

    # ---------------------- SHUTDOWN ----------------------
    logger.info(f"Shutting down {settings.APP_NAME}...")
    logger.info("Shutdown complete.")
