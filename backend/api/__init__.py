"""
api/
-----
Top-level package for all HTTP API route definitions.

Structure:
    api/v1/  -> Version 1 of the API. Each resource/domain gets its own
                router module (e.g. health.py) which is aggregated in
                api/v1/router.py.

Convention for future versions:
    When a breaking change is needed, create api/v2/ alongside api/v1/
    rather than modifying v1 in place. This preserves backward
    compatibility for existing API consumers.

This package should contain ONLY routing/HTTP concerns (request parsing,
response shaping, status codes). Business logic belongs in services/.
"""
