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
      contains no business/lookup logic itself.
    - Unknown tickers are translated into a 404 response here, since
      HTTP status codes are an HTTP-layer concern and should not leak
      into the service layer.

Status (Sprint 6 - Phase 1):
    Returns MOCK data only (see services/company_service.py). No
    external market-data integration (e.g. Yahoo Finance) exists yet —
    that is out of scope for this phase.

Where this fits in the architecture:
    Registered in api/v1/router.py, which aggregates all v1 routers and
    is itself included in main.py under the configured API prefix.
"""

from fastapi import APIRouter, HTTPException, status

from core.logging_config import get_logger
from schemas.company import CompanyResponse
from services.company_service import CompanyNotFoundError, get_company_by_ticker

logger = get_logger(__name__)

router = APIRouter(tags=["Company"])


@router.get(
    "/company/{ticker}",
    response_model=CompanyResponse,
    summary="Get company data by ticker",
    description="Returns company profile and market data for the given "
    "stock ticker symbol. Currently backed by mock data only.",
)
async def get_company(ticker: str) -> CompanyResponse:
    """
    Retrieve company data for a given ticker symbol.

    Args:
        ticker: Stock ticker symbol, case-insensitive (e.g. "AAPL").

    Returns:
        CompanyResponse: Company profile and market data.

    Raises:
        HTTPException: 404 if the ticker is not found in the dataset.
    """
    logger.debug(f"Company data requested for ticker: {ticker}")

    try:
        return get_company_by_ticker(ticker)
    except CompanyNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Company not found for ticker '{ticker.upper()}'",
        ) from exc
