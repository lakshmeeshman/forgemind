"""
core/settings.py
------------------
Centralized application configuration using Pydantic Settings.

Why this file exists:
    Production backends should never hardcode values like ports, environment
    names, CORS origins, or log levels. Instead, all configurable values are
    declared here as a typed `Settings` class and populated from environment
    variables (or a `.env` file during local development).

Design notes:
    - `pydantic-settings` gives us automatic type validation and casting
      (e.g. a bad boolean or int in .env will fail fast at startup instead
      of causing a silent bug later).
    - `lru_cache` ensures the `.env` file / environment is only read once
      per process, and the same Settings instance is reused everywhere
      (a lightweight singleton pattern).
    - This file intentionally contains ONLY configuration — no business
      logic, no service wiring, no database code.

Where this fits in the architecture:
    core/settings.py is the single source of truth for the SHAPE and
    validation rules of environment-driven configuration (the `Settings`
    class + `get_settings()` factory).

    core/config.py (a separate, much smaller file) exposes a ready-to-use
    `settings` object built from this module, so the rest of the codebase
    can simply do `from core.config import settings` without worrying
    about caching or instantiation. See core/config.py for details.
"""

from functools import lru_cache
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application settings.

    Values are loaded from (in order of precedence):
        1. Actual environment variables (highest priority, e.g. set by
           Docker, Kubernetes, or a cloud provider's secret manager).
        2. A local `.env` file (used mainly for local development).
        3. The default values defined below.

    NOTE: This class defines the SHAPE of configuration only.
    It does not contain authentication, database, or AI-specific
    settings yet — those will be added in later stages of the project
    as their respective modules are built out.
    """

    # ------------------------------------------------------------------
    # General application metadata
    # ------------------------------------------------------------------
    APP_NAME: str = "ForgeMind"
    APP_DESCRIPTION: str = "ForgeMind Enterprise Intelligence Platform API"
    APP_VERSION: str = "0.1.0"

    # ENVIRONMENT controls environment-specific behavior throughout the app
    # (e.g. enabling/disabling docs, verbose logging, debug tracebacks).
    # Expected values: "local", "development", "staging", "production"
    ENVIRONMENT: str = "local"

    # DEBUG should always be False in production. It is read from the
    # environment so it can be safely toggled without code changes.
    DEBUG: bool = False

    # ------------------------------------------------------------------
    # Server configuration
    # ------------------------------------------------------------------
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # ------------------------------------------------------------------
    # API versioning
    # ------------------------------------------------------------------
    # All versioned routes are mounted under this prefix, e.g. /api/v1/health
    API_V1_PREFIX: str = "/api/v1"

    # ------------------------------------------------------------------
    # CORS configuration
    # ------------------------------------------------------------------
    # Stored as a raw, comma-separated string (kept as `str` rather than
    # `List[str]` deliberately: pydantic-settings tries to JSON-decode
    # any complex-typed field read from a .env file, which breaks a
    # plain "a,b,c" value). The `cors_origins` property below is the
    # actual list consumers should use.
    # Example .env value:
    #   BACKEND_CORS_ORIGINS=http://localhost:3000,https://app.forgemind.com
    BACKEND_CORS_ORIGINS: str = ""

    @property
    def cors_origins(self) -> List[str]:
        """Parsed list of allowed CORS origins, ready for CORSMiddleware."""
        return [origin.strip() for origin in self.BACKEND_CORS_ORIGINS.split(",") if origin.strip()]

    # ------------------------------------------------------------------
    # Logging configuration
    # ------------------------------------------------------------------
    LOG_LEVEL: str = "INFO"

    # ------------------------------------------------------------------
    # Pydantic Settings configuration
    # ------------------------------------------------------------------
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",  # ignore unrelated env vars instead of erroring
    )


@lru_cache
def get_settings() -> Settings:
    """
    Returns a cached, singleton-like instance of Settings.

    Using lru_cache means the environment / .env file is parsed exactly
    once per process. Downstream code should always call get_settings()
    rather than instantiating Settings() directly, e.g.:

        from core.config import get_settings
        settings = get_settings()
    """
    return Settings()
