"""
services/report_service.py
-----------------------------
Business logic layer for generated reports.

Why this file exists:
    Route handlers in api/ should stay thin: parse the request, call a
    service function, return the response. A report summary aggregates
    data from multiple underlying sources (live company profile +
    intelligence overview), and that aggregation logic belongs here —
    not in the route handler, and not duplicated inside
    services/company_service.py.

Design notes:
    - Reuses `services/company_service.py` rather than duplicating
      ticker-lookup logic. The company PROFILE (name, sector, market
      cap, price) is authoritative and LIVE (Sprint 7 - Yahoo Finance);
      if that lookup fails, the report fails the same way the plain
      `/company/{ticker}` endpoint would (propagating
      `CompanyNotFoundError` / `CompanyDataUnavailableError` unchanged).
    - The intelligence overview (SWOT) is MOCK data (Sprint 8) and only
      covers a curated set of tickers. Rather than letting a missing
      overview break the whole report for an otherwise-valid company,
      `_get_overview_or_default()` falls back to a generic placeholder
      summary — a report should degrade gracefully, not fail outright,
      when only the "nice to have" enrichment data is missing.

Where this fits in the architecture:
    Called by api/v1/reports.py. Raises the same `CompanyNotFoundError`
    / `CompanyDataUnavailableError` exceptions as
    services/company_service.py so the route layer can handle them
    identically.
"""

from datetime import datetime, timezone

from core.logging_config import get_logger
from schemas.company import CompanyOverviewResponse
from schemas.report import ReportSummaryResponse
from services.company_service import (
    CompanyNotFoundError,
    get_company_by_ticker,
    get_company_overview,
)

logger = get_logger(__name__)


def _get_overview_or_default(ticker: str) -> CompanyOverviewResponse:
    """
    Fetch the curated intelligence overview for a ticker, falling back
    to a generic placeholder if none exists.

    This intentionally does NOT propagate `CompanyNotFoundError` — by
    the time this is called, `get_company_by_ticker()` has already
    confirmed the company itself is real. A missing *overview* just
    means our curated intelligence dataset hasn't been extended to
    cover this ticker yet, which should degrade the report gracefully
    rather than fail it outright.
    """
    try:
        return get_company_overview(ticker)
    except CompanyNotFoundError:
        logger.info(
            f"No curated intelligence overview for '{ticker}' — "
            "using generic fallback summary for report."
        )
        return CompanyOverviewResponse(
            ticker=ticker,
            summary=(
                f"{ticker} has not yet undergone deep intelligence "
                "ingestion. This summary reflects baseline market data "
                "only; a full SWOT analysis will be available once "
                "ingestion pipelines cover this company."
            ),
            strengths=["Established market presence."],
            weaknesses=["Limited proprietary intelligence data available yet."],
            opportunities=["Further ingestion may surface strategic opportunities."],
            threats=["Insufficient data to assess competitive threats at this time."],
        )


def get_report_summary(ticker: str) -> ReportSummaryResponse:
    """
    Build an executive report summary for a ticker, combining live
    company profile data with intelligence overview highlights.

    Args:
        ticker: Stock ticker symbol, case-insensitive (e.g. "aapl" or
            "AAPL").

    Returns:
        ReportSummaryResponse: Aggregated executive summary.

    Raises:
        CompanyNotFoundError: If the ticker does not correspond to a
            real, tradable company (from the underlying live profile
            lookup).
        CompanyDataUnavailableError: If the live market-data provider
            could not be reached (from the underlying live profile
            lookup).
    """
    normalized_ticker = ticker.strip().upper()
    logger.debug(f"Building report summary for ticker: {normalized_ticker}")

    # Company profile is authoritative and live — if this fails, the
    # whole report fails the same way GET /company/{ticker} would.
    profile = get_company_by_ticker(normalized_ticker)

    overview = _get_overview_or_default(normalized_ticker)

    logger.debug(f"Report summary built successfully for ticker: {normalized_ticker}")
    return ReportSummaryResponse(
        ticker=profile.ticker,
        company_name=profile.name,
        sector=profile.sector,
        industry=profile.industry,
        market_cap=profile.market_cap,
        current_price=profile.current_price,
        currency=profile.currency,
        executive_summary=overview.summary,
        key_strengths=overview.strengths,
        key_risks=overview.weaknesses + overview.threats,
        generated_at=datetime.now(timezone.utc),
    )
