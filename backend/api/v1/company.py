"""
api/v1/company.py
--------------------
Company data endpoint router.

Why this file exists:
    Exposes company/ticker information to API consumers. This is the
    first data-oriented endpoint group in ForgeMind (previously only
    /health existed), establishing the pattern for future resource
    endpoints: thin route handler + service-layer business logic +
    dedicated response schema.

Design notes:
    - The route handler ONLY parses the request, delegates to
      `services/company_service.py`, and shapes the HTTP response. It
      contains no business/lookup/provider logic itself.
    - Unknown tickers are translated into a 404 response here, since
      HTTP status codes are an HTTP-layer concern and should not leak
      into the service layer.
    - Upstream provider failures (e.g. Yahoo Finance unreachable) are
      translated into a 503 response, distinct from 404, so API
      consumers can tell "this company doesn't exist" apart from
      "try again later".

Status (Sprint 7 - Live Market Data Integration):
    Backed by LIVE data fetched from Yahoo Finance (see
    services/company_service.py). The endpoint contract (path,
    response model, and 404-for-unknown-ticker behavior) is unchanged
    from Sprint 6.

Where this fits in the architecture:
    Registered in api/v1/router.py, which aggregates all v1 routers and
    is itself included in main.py under the configured API prefix.
"""

from fastapi import APIRouter, HTTPException, status

from core.logging_config import get_logger
from schemas.company import CompanyResponse
from services.company_service import (
    CompanyDataUnavailableError,
    CompanyNotFoundError,
    get_company_by_ticker,
)

logger = get_logger(__name__)

router = APIRouter(tags=["Company"])


@router.get(
    "/company/{ticker}",
    response_model=CompanyResponse,
    summary="Get company data by ticker",
    description="Returns live company profile and market data for the "
    "given stock ticker symbol, sourced from Yahoo Finance.",
)
async def get_company(ticker: str) -> CompanyResponse:
    """
    Retrieve live company data for a given ticker symbol.

    Args:
        ticker: Stock ticker symbol, case-insensitive (e.g. "AAPL").

    Returns:
        CompanyResponse: Company profile and market data.

    Raises:
        HTTPException: 404 if the ticker does not correspond to a real
            company. 503 if the upstream data provider is temporarily
            unavailable.
    """
    logger.debug(f"Company data requested for ticker: {ticker}")

    try:
        return get_company_by_ticker(ticker)
    except CompanyNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Company not found for ticker '{ticker.upper()}'",
        ) from exc
    except CompanyDataUnavailableError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Company data provider is temporarily unavailable. Please try again later.",
        ) from exc
