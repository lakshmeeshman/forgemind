"""
api/v1/router.py
-------------------
Aggregates all individual routers belonging to API version 1.

Why this file exists:
    As the number of endpoint groups grows (health, and later — company
    data, auth, AI features, etc.), main.py should not need to know about
    every individual router. Instead, each version of the API exposes a
    single combined router that main.py includes once.

Design notes:
    - This is the ONLY place new v1 sub-routers need to be registered.
      Adding a new endpoint group later (e.g. `auth.py`) means:
        1. Create api/v1/auth.py with its own APIRouter
        2. Import it here and add `api_router.include_router(auth.router)`
      main.py itself never needs to change.

Where this fits in the architecture:
    Included by main.py under the `settings.API_V1_PREFIX` prefix
    (e.g. "/api/v1"), so every route defined here automatically becomes
    available at /api/v1/<route>.
"""

from fastapi import APIRouter

from api.v1 import company, health, reports

# Single combined router for API version 1.
api_router = APIRouter()

# Register individual endpoint-group routers below.
api_router.include_router(health.router)
api_router.include_router(company.router)
api_router.include_router(reports.router)

# Future endpoint groups (NOT implemented yet, per project scope):
# api_router.include_router(auth.router)
# api_router.include_router(ai.router)
