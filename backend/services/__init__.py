"""
services/
----------
Business logic layer.

Why this package exists:
    Route handlers in api/ should stay thin: parse the request, call a
    service function, return the response. All actual business logic
    (orchestration, calculations, calls to external systems, etc.)
    belongs in this package instead of directly in route handlers.

    This separation makes business logic reusable (callable from
    multiple routes, background jobs, or CLI scripts) and independently
    testable without spinning up the HTTP layer.

Status:
    Intentionally empty at this stage. This project step only scaffolds
    the backend foundation — no business logic has been implemented yet,
    per project scope.
"""
