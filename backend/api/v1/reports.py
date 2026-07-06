"""
api/v1/reports.py
--------------------
Reports endpoint router.

Why this file exists:
    Reports are a distinct resource from company data proper (see
    schemas/report.py for the rationale), so they get their own router
    module and URL namespace (`/reports/...`) rather than being nested
    under `/company/...`.

Design notes:
    - The route handler ONLY parses the request, delegates to
      `services/report_service.py`, and shapes the HTTP response.
    - Error translation mirrors `api/v1/company.py` exactly (404 for
      unknown ticker, 503 for upstream provider failure), since a
      report summary's underlying company-profile lookup is live and
      can fail the same ways.

Status (Sprint 8 - Company Intelligence APIs):
    Returns an aggregated executive summary combining LIVE company
    profile data with MOCK intelligence overview data (see
    services/report_service.py).

Where this fits in the architecture:
    Registered in api/v1/router.py, which aggregates all v1 routers and
    is itself included in main.py under the configured API prefix.
"""

from fastapi import APIRouter, HTTPException, status

from core.logging_config import get_logger
from schemas.report import ReportSummaryResponse
from services.company_service import CompanyDataUnavailableError, CompanyNotFoundError
from services.report_service import get_report_summary

logger = get_logger(__name__)

router = APIRouter(tags=["Reports"])


@router.get(
    "/reports/summary/{ticker}",
    response_model=ReportSummaryResponse,
    summary="Get executive report summary",
    description="Returns an aggregated executive summary for the given "
    "ticker, combining live company profile data with intelligence "
    "overview highlights.",
)
async def get_report_summary_endpoint(ticker: str) -> ReportSummaryResponse:
    """
    Retrieve an executive report summary for a given ticker symbol.

    Args:
        ticker: Stock ticker symbol, case-insensitive (e.g. "AAPL").

    Returns:
        ReportSummaryResponse: Aggregated executive summary.

    Raises:
        HTTPException: 404 if the ticker does not correspond to a real
            company. 503 if the upstream data provider is temporarily
            unavailable.
    """
    logger.debug(f"Report summary requested for ticker: {ticker}")

    try:
        return get_report_summary(ticker)
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
