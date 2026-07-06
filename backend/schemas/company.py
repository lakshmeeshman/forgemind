"""
schemas/company.py
---------------------
Pydantic schemas (request/response models) related to company data.

Why this file exists:
    The `schemas/` package holds Pydantic models that define the shape of
    data crossing the API boundary (request bodies and response payloads).
    Keeping schemas separate from route handlers (api/) and from internal
    domain models (models/) is a core clean-architecture practice:
    it lets the external API contract evolve independently of internal
    representations.

Where this fits in the architecture:
    Used by api/v1/company.py to define exactly what the
    `/company/{ticker}` endpoint returns, so FastAPI can validate and
    auto-document the response shape in the OpenAPI docs.

Status (Sprint 6 - Phase 1):
    Backed by mock data only (see services/company_service.py). Field
    shapes are intentionally designed to match what a real market-data
    provider (e.g. Yahoo Finance) would eventually return, so that
    swapping the data source later will not require changing this
    schema.
"""

from pydantic import BaseModel, Field


class CompanyResponse(BaseModel):
    """Response payload returned by the /company/{ticker} endpoint."""

    ticker: str = Field(..., examples=["AAPL"], description="Stock ticker symbol")
    name: str = Field(..., examples=["Apple Inc."], description="Full company name")
    sector: str = Field(..., examples=["Technology"], description="Company sector")
    industry: str = Field(
        ..., examples=["Consumer Electronics"], description="Company industry"
    )
    market_cap: int = Field(
        ..., examples=[3123000000000], description="Market capitalization in USD"
    )
    current_price: float = Field(
        ..., examples=[241.15], description="Current share price"
    )
    currency: str = Field(..., examples=["USD"], description="Currency of the price/market cap")
