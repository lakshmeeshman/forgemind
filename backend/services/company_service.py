"""
services/company_service.py
------------------------------
Business logic layer for company data.

Why this file exists:
    Route handlers in api/ should stay thin: parse the request, call a
    service function, return the response. All actual business logic
    (looking up company data, and later — calling out to a real market
    data provider, caching, retry logic, etc.) belongs here instead of
    directly in the route handler.

Status (Sprint 6 - Phase 1):
    Returns MOCK data only, keyed by ticker symbol, from an in-memory
    lookup table. No external market-data integration (e.g. Yahoo
    Finance) exists yet — that is explicitly out of scope for this
    phase and will replace/extend `_MOCK_COMPANIES` in a future sprint
    without requiring any change to the route layer or response schema.

Where this fits in the architecture:
    Called by api/v1/company.py. Raises `CompanyNotFoundError` for
    unknown tickers; the route layer is responsible for translating
    that into the appropriate HTTP response.
"""

from core.logging_config import get_logger
from schemas.company import CompanyResponse

logger = get_logger(__name__)


class CompanyNotFoundError(Exception):
    """
    Raised when no company data exists for a given ticker.

    Kept as a plain domain-level exception (rather than raising an
    HTTPException directly from the service layer) so that the service
    layer stays framework-agnostic and reusable outside of an HTTP
    context (e.g. from a background job or CLI script in the future).
    """

    def __init__(self, ticker: str):
        self.ticker = ticker
        super().__init__(f"No company data found for ticker '{ticker}'")


# ----------------------------------------------------------------------
# Mock data store
# ----------------------------------------------------------------------
# TEMPORARY: hardcoded mock dataset for Sprint 6 - Phase 1. This will be
# replaced by a real market-data integration (e.g. Yahoo Finance) in a
# future sprint. Keys are normalized to uppercase ticker symbols.
_MOCK_COMPANIES: dict[str, CompanyResponse] = {
    "AAPL": CompanyResponse(
        ticker="AAPL",
        name="Apple Inc.",
        sector="Technology",
        industry="Consumer Electronics",
        market_cap=3123000000000,
        current_price=241.15,
        currency="USD",
    ),
    "MSFT": CompanyResponse(
        ticker="MSFT",
        name="Microsoft Corporation",
        sector="Technology",
        industry="Software - Infrastructure",
        market_cap=3180000000000,
        current_price=427.80,
        currency="USD",
    ),
    "TSLA": CompanyResponse(
        ticker="TSLA",
        name="Tesla, Inc.",
        sector="Consumer Cyclical",
        industry="Auto Manufacturers",
        market_cap=798000000000,
        current_price=248.50,
        currency="USD",
    ),
}


def get_company_by_ticker(ticker: str) -> CompanyResponse:
    """
    Look up mock company data by ticker symbol.

    Args:
        ticker: Stock ticker symbol, case-insensitive (e.g. "aapl" or
            "AAPL").

    Returns:
        CompanyResponse: The mock company data for the given ticker.

    Raises:
        CompanyNotFoundError: If the ticker does not exist in the mock
            dataset.
    """
    normalized_ticker = ticker.strip().upper()

    company = _MOCK_COMPANIES.get(normalized_ticker)
    if company is None:
        logger.warning(f"Company lookup failed — unknown ticker: {normalized_ticker}")
        raise CompanyNotFoundError(normalized_ticker)

    logger.debug(f"Company lookup succeeded for ticker: {normalized_ticker}")
    return company
