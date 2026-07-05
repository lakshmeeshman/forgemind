"""
schemas/
---------
Pydantic schemas defining the external API contract (request/response
bodies).

Why this package exists:
    Schemas are the "shape" of data as it crosses the HTTP boundary.
    They are intentionally kept separate from models/ (internal
    domain/database representations) so that the public API can remain
    stable even as internal implementation details change.

Current contents:
    health.py -> response schema for the /health endpoint.
"""
