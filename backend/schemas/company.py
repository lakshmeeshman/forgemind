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
    Used by api/v1/company.py to define exactly what each `/company/...`
    endpoint returns, so FastAPI can validate and auto-document the
    response shape in the OpenAPI docs.

Status:
    - CompanyResponse (Sprint 6/7): backed by LIVE Yahoo Finance data
      (see services/company_service.py).
    - All other schemas below (Sprint 8 - Company Intelligence APIs):
      backed by MOCK data only (see services/company_service.py). Field
      shapes are intentionally designed to match what a real
      intelligence pipeline (SWOT analysis, financial statements,
      competitor benchmarking, news/sentiment ingestion, forecasting)
      would eventually return, so swapping in real data sources later
      will not require changing these schemas.
"""

from typing import Literal

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


class CompanyOverviewResponse(BaseModel):
    """Response payload returned by the /company/{ticker}/overview endpoint."""

    ticker: str = Field(..., examples=["AAPL"], description="Stock ticker symbol")
    summary: str = Field(
        ..., description="Narrative summary of the company's market position"
    )
    strengths: list[str] = Field(..., description="Key competitive strengths (SWOT)")
    weaknesses: list[str] = Field(..., description="Key competitive weaknesses (SWOT)")
    opportunities: list[str] = Field(
        ..., description="Key growth opportunities (SWOT)"
    )
    threats: list[str] = Field(..., description="Key external threats (SWOT)")


class ProductResponse(BaseModel):
    """A single product/business line, part of the /company/{ticker}/products response."""

    id: str = Field(..., examples=["prod_aapl_1"], description="Unique product identifier")
    name: str = Field(..., examples=["iPhone"], description="Product or business line name")
    description: str = Field(..., description="Short description of the product/business line")
    market_share: float = Field(
        ..., examples=[42.5], description="Estimated market share percentage"
    )
    revenue_segment: str = Field(
        ..., examples=["Consumer Hardware"], description="Revenue segment this product belongs to"
    )


class FinancialLineItem(BaseModel):
    """A single labeled row within a financial statement, e.g. 'Total Revenue'."""

    label: str = Field(..., examples=["Total Revenue"], description="Line item label")
    is_total: bool = Field(
        default=False, description="Whether this row represents a subtotal/total (for bold display)"
    )
    values: list[float] = Field(
        ..., description="Values for this line item, one per entry in `years`"
    )


class FinancialsResponse(BaseModel):
    """Response payload returned by the /company/{ticker}/financials endpoint."""

    ticker: str = Field(..., examples=["AAPL"], description="Stock ticker symbol")
    years: list[str] = Field(
        ..., examples=[["FY 2023", "FY 2024", "FY 2025"]], description="Fiscal periods covered"
    )
    income_statement: list[FinancialLineItem] = Field(
        ..., description="Income statement line items"
    )
    balance_sheet: list[FinancialLineItem] = Field(
        ..., description="Balance sheet line items"
    )
    cash_flow: list[FinancialLineItem] = Field(
        ..., description="Cash flow statement line items"
    )


class CompetitorResponse(BaseModel):
    """A single competitor row, part of the /company/{ticker}/competitors response."""

    name: str = Field(..., examples=["Global Rival A"], description="Competitor company name")
    market_cap: str = Field(..., examples=["$145.0B"], description="Competitor market capitalization, formatted")
    pe_ratio: str = Field(..., examples=["28.5"], description="Price-to-earnings ratio")
    revenue_growth: str = Field(..., examples=["8.2%"], description="Year-over-year revenue growth")
    operating_margin: str = Field(..., examples=["18.4%"], description="Operating margin")
    rd_intensity: str = Field(..., examples=["9.2%"], description="R&D spend as a percentage of revenue")
    debt_to_equity: str = Field(..., examples=["0.45"], description="Debt-to-equity ratio")
    is_target_company: bool = Field(
        default=False, description="True if this row represents the queried company itself"
    )


class NewsArticleResponse(BaseModel):
    """A single article, part of the /company/{ticker}/news response."""

    id: str = Field(..., examples=["news_aapl_1"], description="Unique article identifier")
    title: str = Field(..., description="Article headline")
    source: str = Field(..., examples=["Reuters"], description="Publication source")
    url: str = Field(..., description="Link to the full article")
    published_at: str = Field(..., examples=["2026-07-01T09:00:00Z"], description="Publication timestamp")
    summary: str = Field(..., description="Short summary of the article")
    sentiment: Literal["positive", "neutral", "negative"] = Field(
        ..., description="Overall sentiment of the article"
    )
    impact_score: int = Field(
        ..., ge=0, le=10, examples=[8], description="Estimated market impact, 0 (low) to 10 (high)"
    )


class SentimentScore(BaseModel):
    """A single sentiment sub-score, e.g. social or earnings-call sentiment."""

    score: int = Field(..., ge=0, le=100, description="Sentiment score, 0-100")
    label: str = Field(..., examples=["Bullish Inflow"], description="Human-readable sentiment label")


class SentimentResponse(BaseModel):
    """Response payload returned by the /company/{ticker}/sentiment endpoint."""

    ticker: str = Field(..., examples=["AAPL"], description="Stock ticker symbol")
    positive: int = Field(..., ge=0, le=100, description="Overall positive sentiment percentage")
    neutral: int = Field(..., ge=0, le=100, description="Overall neutral sentiment percentage")
    negative: int = Field(..., ge=0, le=100, description="Overall negative sentiment percentage")
    social_sentiment: SentimentScore = Field(..., description="Sentiment derived from social media monitoring")
    earnings_call_sentiment: SentimentScore = Field(..., description="Sentiment derived from earnings call transcripts")
    employee_sentiment: SentimentScore = Field(..., description="Sentiment derived from employee review platforms")


class ForecastResponse(BaseModel):
    """A single forecast period, part of the /company/{ticker}/forecast response."""

    year: str = Field(..., examples=["2026 (Proj)"], description="Forecast period label")
    revenue: float = Field(..., description="Projected revenue, in billions")
    growth: float = Field(..., description="Projected year-over-year growth percentage")
    ebitda: float = Field(..., description="Projected EBITDA, in billions")
    scenario: str = Field(..., examples=["Base"], description="Forecast scenario name")
