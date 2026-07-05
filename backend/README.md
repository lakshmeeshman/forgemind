# ForgeMind Backend

Backend foundation for **ForgeMind — Enterprise Intelligence Platform**.

> **Scope of this stage:** this is a production-ready *scaffold* only.
> No business logic, authentication, database, or AI/ML features have
> been implemented yet — those come in later stages, built on top of
> this foundation.

## Project structure

```
backend/
│
├── api/                  # HTTP layer — route handlers only, no business logic
│   ├── __init__.py
│   └── v1/               # API version 1
│       ├── __init__.py
│       ├── health.py     # GET /api/v1/health
│       └── router.py     # combines all v1 routers into one
│
├── services/             # Business logic layer (empty — future stage)
├── models/               # Internal domain / DB models (empty — future stage)
├── schemas/              # Pydantic request/response schemas
│   └── health.py         # response shape for /health
├── ai/                   # Reserved for future AI features (empty)
├── ml/                   # Reserved for future ML components (empty)
│
├── core/                 # Cross-cutting infrastructure
│   ├── settings.py       # Pydantic Settings schema + get_settings()
│   ├── config.py         # pre-instantiated `settings` singleton
│   ├── logging_config.py # centralized logging setup
│   └── events.py         # FastAPI startup/shutdown lifespan
│
├── utils/                # Small generic helpers (empty — future stage)
├── tests/
│   └── test_health.py    # smoke test for /health
│
├── main.py               # application entrypoint / FastAPI factory
├── requirements.txt
├── .env.example
├── .gitignore
└── README.md
```

## Architecture principles

- **Separation of concerns** — routing (`api/`), business logic
  (`services/`), data contracts (`schemas/`), internal models
  (`models/`), and infrastructure (`core/`) each live in their own
  package so the codebase scales cleanly as features are added.
- **Environment-driven configuration** — nothing is hardcoded. All
  configurable values flow through `core/settings.py`
  (Pydantic Settings), sourced from environment variables or `.env`.
- **API versioning from day one** — all routes live under `/api/v1`,
  so a future `/api/v2` can be introduced without breaking existing
  consumers.
- **Thin entrypoint** — `main.py` only wires things together
  (settings, logging, CORS, lifespan, routers). It contains no business
  logic itself.

## Getting started

### 1. Create a virtual environment

```bash
python3 -m venv venv
source venv/bin/activate      # on Windows: venv\Scripts\activate
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure environment variables

```bash
cp .env.example .env
# then edit .env as needed
```

### 4. Run the server

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:

- Health check: http://localhost:8000/api/v1/health
- Interactive docs (Swagger): http://localhost:8000/docs
- Alternative docs (ReDoc): http://localhost:8000/redoc

### 5. Run tests

```bash
pytest
```

## Adding a new endpoint group (future work)

1. Create `api/v1/<resource>.py` with its own `APIRouter`.
2. Register it in `api/v1/router.py`:
   ```python
   from api.v1 import <resource>
   api_router.include_router(<resource>.router)
   ```
3. Define request/response shapes in `schemas/<resource>.py`.
4. Put actual business logic in `services/<resource>_service.py`, and
   call it from the route handler — keep the route handler thin.

## Explicitly out of scope for this stage

The following are intentionally **not** included yet, per project
scope, and will be introduced in later stages:

- Authentication / authorization
- Database integration (models/ is currently an empty placeholder)
- AI features (ai/ is currently an empty placeholder)
- ML models (ml/ is currently an empty placeholder)
- Business/domain logic (services/ is currently an empty placeholder)
