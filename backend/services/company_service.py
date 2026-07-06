"""
services/company_service.py
------------------------------
Business logic layer for company data.

Why this file exists:
    Route handlers in api/ should stay thin: parse the request, call a
    service function, return the response. All actual business logic
    (fetching company data, mapping provider fields, validating data,
    caching, retry logic, etc.) belongs here instead of directly in the
    route handler.

Status (Sprint 7 - Live Market Data Integration):
    Fetches LIVE company data from Yahoo Finance via the `yfinance`
    library, replacing the Sprint 6 mock dataset. The public function
    signature (`get_company_by_ticker`) and both domain exceptions are
    unchanged, so api/v1/company.py did not need to change its call
    pattern for the happy path.

Provider abstraction:
    All Yahoo-Finance-specific code is isolated in the private
    `_fetch_raw_company_data()` and `_map_yahoo_fields()` helpers below.
    Swapping to a different market-data provider in the future means
    replacing those two helpers only — `get_company_by_ticker()`,
    `CompanyResponse`, and the route layer would not need to change.

Where this fits in the architecture:
    Called by api/v1/company.py. Raises `CompanyNotFoundError` for
    unknown/delisted tickers and `CompanyDataUnavailableError` for
    upstream/provider failures (network issues, unexpected response
    shape, etc.). The route layer is responsible for translating those
    into the appropriate HTTP response.
"""

from typing import Any

import yfinance as yf

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


class CompanyDataUnavailableError(Exception):
    """
    Raised when the upstream market-data provider could not be reached
    or returned an unexpected/unusable response, as distinct from the
    ticker genuinely not existing.

    Kept separate from `CompanyNotFoundError` so callers (and the route
    layer) can distinguish "this company doesn't exist" (404) from
    "the data provider is currently having problems" (503) — the two
    have very different meanings for an API consumer.
    """

    def __init__(self, ticker: str):
        self.ticker = ticker
        super().__init__(f"Company data temporarily unavailable for ticker '{ticker}'")


# ----------------------------------------------------------------------
# Provider-specific data access (Yahoo Finance via yfinance)
# ----------------------------------------------------------------------
# Everything below this point is the ONLY code that knows about Yahoo
# Finance / yfinance. Keeping it isolated here means a future switch to
# a different provider only touches these two helpers.

def _fetch_raw_company_data(ticker: str) -> dict[str, Any]:
    """
    Fetch the raw `info` dictionary for a ticker from Yahoo Finance.

    Args:
        ticker: Normalized (uppercase, trimmed) ticker symbol.

    Returns:
        dict[str, Any]: The raw `Ticker.info` payload from yfinance.
            May be empty or sparse for invalid/delisted tickers —
            interpreting that is the caller's responsibility, not this
            function's.

    Raises:
        CompanyDataUnavailableError: If yfinance/the network call itself
            fails (timeouts, connection errors, unexpected exceptions
            from the underlying HTTP client, etc.). This does NOT cover
            the "ticker doesn't exist" case, since yfinance does not
            raise for that — it simply returns sparse data, which
            `get_company_by_ticker()` detects separately.
    """
    try:
        yf_ticker = yf.Ticker(ticker)
        info = yf_ticker.info
    except Exception as exc:
        # yfinance can raise a variety of exception types depending on
        # the failure mode (network errors, JSON decode errors, HTTP
        # errors from Yahoo's endpoints, etc.). We deliberately catch
        # broadly here because ANY failure at this boundary means the
        # same thing to the rest of the app: the upstream provider is
        # unavailable right now.
        logger.error(
            f"Yahoo Finance request failed for ticker '{ticker}': {exc}",
            exc_info=True,
        )
        raise CompanyDataUnavailableError(ticker) from exc

    return info or {}


def _map_yahoo_fields(ticker: str, info: dict[str, Any]) -> CompanyResponse:
    """
    Map a raw Yahoo Finance `info` dictionary into a `CompanyResponse`.

    Handles missing/null fields safely by falling back to sensible
    defaults rather than raising, since Yahoo Finance frequently omits
    fields depending on the security type (e.g. ETFs lack `sector`).

    Args:
        ticker: Normalized ticker symbol (used for the response and
            for defaulting the company name if Yahoo doesn't supply one).
        info: Raw `Ticker.info` payload from yfinance.

    Returns:
        CompanyResponse: Fully populated, validated response model.
    """
    name = info.get("longName") or info.get("shortName") or ticker
    sector = info.get("sector") or "Unknown"
    industry = info.get("industry") or "Unknown"
    market_cap = info.get("marketCap") or 0

    # Yahoo exposes the live price under different keys depending on
    # market state / security type. Prefer the most "current" field
    # available and fall back through progressively less precise ones.
    current_price = (
        info.get("currentPrice")
        or info.get("regularMarketPrice")
        or info.get("previousClose")
        or 0.0
    )

    currency = info.get("currency") or "USD"

    return CompanyResponse(
        ticker=ticker,
        name=name,
        sector=sector,
        industry=industry,
        market_cap=int(market_cap),
        current_price=float(current_price),
        currency=currency,
    )


def _looks_like_valid_company(info: dict[str, Any]) -> bool:
    """
    Determine whether a raw Yahoo Finance `info` payload represents a
    real, tradable company/security.

    Why this is needed:
        Unlike a typical REST API, yfinance does NOT raise an exception
        or return an HTTP error for an invalid/unknown ticker — it
        simply returns a sparse dictionary (often containing only a
        couple of unrelated keys with `None` values). We therefore have
        to infer validity from the presence of core identifying fields.

    Args:
        info: Raw `Ticker.info` payload from yfinance.

    Returns:
        bool: True if the payload has enough data to be considered a
            real company, False otherwise.
    """
    if not info:
        return False

    has_identity = bool(info.get("longName") or info.get("shortName"))
    has_price_data = bool(
        info.get("currentPrice")
        or info.get("regularMarketPrice")
        or info.get("previousClose")
    )

    return has_identity and has_price_data


# ----------------------------------------------------------------------
# Public service API
# ----------------------------------------------------------------------

def get_company_by_ticker(ticker: str) -> CompanyResponse:
    """
    Look up live company data by ticker symbol via Yahoo Finance.

    Args:
        ticker: Stock ticker symbol, case-insensitive (e.g. "aapl" or
            "AAPL").

    Returns:
        CompanyResponse: Live company profile and market data.

    Raises:
        CompanyNotFoundError: If the ticker does not correspond to a
            real, tradable company (invalid, delisted, or unrecognized
            symbol).
        CompanyDataUnavailableError: If the Yahoo Finance provider
            could not be reached or returned an unexpected/unusable
            response.
    """
    normalized_ticker = ticker.strip().upper()

    info = _fetch_raw_company_data(normalized_ticker)

    if not _looks_like_valid_company(info):
        logger.warning(f"Company lookup failed — unknown ticker: {normalized_ticker}")
        raise CompanyNotFoundError(normalized_ticker)

    logger.debug(f"Company lookup succeeded for ticker: {normalized_ticker}")
    return _map_yahoo_fields(normalized_ticker, info)
