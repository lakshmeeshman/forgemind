"""
models/
--------
Internal domain / database models.

Why this package exists:
    This is where ORM models (e.g. SQLAlchemy models) or internal domain
    entities will live once persistence is introduced. Keeping these
    separate from schemas/ (the external API contract) means the
    database structure can evolve without breaking the public API shape,
    and vice versa.

Status:
    Intentionally empty at this stage. No database or persistence layer
    has been implemented yet, per project scope.
"""
