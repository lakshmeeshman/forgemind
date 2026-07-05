"""
core/config.py
----------------
Convenience module exposing a ready-to-use `settings` singleton.

Why this file exists (and how it differs from core/settings.py):
    - `core/settings.py` defines the `Settings` SCHEMA (a Pydantic model
      with field types, defaults, and validators) plus the cached
      `get_settings()` factory function.
    - `core/config.py` (this file) simply calls that factory once and
      re-exports the resulting object as `settings`. This gives the rest
      of the codebase a very short, ergonomic import:

          from core.config import settings
          settings.APP_NAME

      instead of having to call `get_settings()` everywhere.

    Both files are kept because larger codebases typically want:
      1. A single place where the *shape* of configuration is declared
         and validated (settings.py).
      2. A single, already-instantiated object that's cheap and
         convenient to import anywhere else in the app (config.py).

Where this fits in the architecture:
    Any module that needs a config VALUE (e.g. `settings.LOG_LEVEL`)
    should import from here. Only settings.py itself should deal with
    the `Settings` class and `get_settings()` factory directly.
"""

from core.settings import get_settings

# A single, process-wide settings instance, safe to import anywhere.
settings = get_settings()
