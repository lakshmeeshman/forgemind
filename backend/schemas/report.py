"""
schemas/report.py
--------------------
Pydantic schemas (request/response models) related to generated reports.

Why this file exists:
    Reports are a distinct resource from company data proper — a report
    is a synthesized document that draws on multiple underlying data
    sources (company profile, intelligence overview, and eventually
    financials, news, sentiment, etc.). Keeping its schema in its own
    module — separate from schemas/company.py — reflects that it is a
    different domain concept, even though it currently aggregates
    company-scoped data.

Where this fits in the architecture:
    Used by api/v1/reports.py to define exactly what the
    `/reports/summary/{ticker}` endpoint returns.

Status (Sprint 8 - Company Intelligence APIs):
    Aggregates LIVE company profile data (see services/company_service.py)
    with MOCK intelligence data (SWOT overview) into a single executive
    summary. As real intelligence pipelines come online in future
    sprints, the underlying data sources will change but this response
    shape is designed to remain stable.
"""

from datetime import datetime

from pydantic import BaseModel, Field


class ReportSummaryResponse(BaseModel):
    """Response payload returned by the /reports/summary/{ticker} endpoint."""

    ticker: str = Field(..., examples=["AAPL"], description="Stock ticker symbol")
    company_name: str = Field(..., examples=["Apple Inc."], description="Full company name")
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
    executive_summary: str = Field(
        ..., description="Narrative executive summary of the company's market position"
    )
    key_strengths: list[str] = Field(
        ..., description="Top strengths pulled from the company's intelligence overview"
    )
    key_risks: list[str] = Field(
        ..., description="Top risks (weaknesses + threats) pulled from the company's intelligence overview"
    )
    generated_at: datetime = Field(
        ..., description="UTC timestamp at which this report summary was generated"
    )
