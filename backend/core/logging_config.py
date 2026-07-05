"""
core/logging_config.py
------------------------
Centralized logging configuration for the entire backend.

Why this file exists:
    Relying on `print()` or ad-hoc `logging.basicConfig()` calls scattered
    across a codebase makes production debugging painful. This module
    configures Python's standard `logging` module ONE TIME, at startup,
    with a consistent format across every module in the project.

Design notes:
    - Log level is driven by `Settings.LOG_LEVEL`, so it can be changed
      per-environment (e.g. DEBUG locally, INFO/WARNING in production)
      without touching code.
    - Uses a structured, readable log format that includes timestamp,
      log level, logger name (module), and the message — this is enough
      to trace an issue back to its source file.
    - Exposes `get_logger(name)` as the standard way for any module to
      obtain a logger, keeping usage consistent project-wide:

          from core.logging_config import get_logger
          logger = get_logger(__name__)
          logger.info("Something happened")

Where this fits in the architecture:
    This is called once from main.py during application startup
    (`configure_logging()`), before the FastAPI app starts handling
    requests. Every other module simply calls `get_logger(__name__)`.
"""

import logging
import sys

from core.settings import get_settings


LOG_FORMAT = "%(asctime)s | %(levelname)-8s | %(name)s | %(message)s"
DATE_FORMAT = "%Y-%m-%d %H:%M:%S"


def configure_logging() -> None:
    """
    Configures the root logger for the application.

    This should be called exactly once, during application startup
    (see main.py's `lifespan` / startup event). It sets:
        - the global log level (from settings)
        - the log message format
        - the output stream (stdout, which is best practice for
          containerized environments so logs can be captured by
          Docker/Kubernetes/hosting platforms)
    """
    settings = get_settings()

    logging.basicConfig(
        level=settings.LOG_LEVEL.upper(),
        format=LOG_FORMAT,
        datefmt=DATE_FORMAT,
        stream=sys.stdout,
        force=True,  # ensures re-configuration works cleanly if called twice (e.g. in tests)
    )

    # Quiet down overly chatty third-party loggers if needed.
    # Kept minimal here since no external integrations exist yet.
    logging.getLogger("uvicorn.access").setLevel(settings.LOG_LEVEL.upper())


def get_logger(name: str) -> logging.Logger:
    """
    Returns a named logger instance.

    Usage:
        logger = get_logger(__name__)
        logger.info("ForgeMind service started")

    Passing `__name__` ensures log lines are traceable to the exact
    module that emitted them.
    """
    return logging.getLogger(name)
