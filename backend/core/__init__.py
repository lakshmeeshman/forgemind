"""
core/
------
Cross-cutting application infrastructure: configuration, logging, and
startup/shutdown lifecycle management.

Contents:
    settings.py       -> Pydantic Settings schema + get_settings() factory
    config.py         -> convenient pre-instantiated `settings` object
    logging_config.py -> centralized logging setup + get_logger() helper
    events.py         -> FastAPI lifespan (startup/shutdown) handler

Everything in this package is environment/infrastructure concern only —
no business logic, no route handlers.
"""
