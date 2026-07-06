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
    GET /company/{ticker} is backed by LIVE data fetched from Yahoo
    Finance (see services/company_service.py). The endpoint contract
    (path, response model, and 404-for-unknown-ticker behavior) is
    unchanged from Sprint 6.

Status (Sprint 8 - Company Intelligence APIs):
    Adds seven MOCK-data-backed sub-resource endpoints (overview,
    products, financials, competitors, news, sentiment, forecast).
    These share the same 404-for-unknown-ticker behavior as the
    profile endpoint, but do not call any live external provider, so
    they never raise/return 503.

Where this fits in the architecture:
    Registered in api/v1/router.py, which aggregates all v1 routers and
    is itself included in main.py under the configured API prefix.
"""

from fastapi import APIRouter, HTTPException, status

from core.logging_config import get_logger
from schemas.company import (
    CompanyOverviewResponse,
    CompanyResponse,
    CompetitorResponse,
    FinancialsResponse,
    ForecastResponse,
    NewsArticleResponse,
    ProductResponse,
    SentimentResponse,
)
from services.company_service import (
    CompanyDataUnavailableError,
    CompanyNotFoundError,
    get_company_by_ticker,
    get_company_competitors,
    get_company_financials,
    get_company_forecast,
    get_company_news,
    get_company_overview,
    get_company_products,
    get_company_sentiment,
)

logger = get_logger(__name__)

router = APIRouter(tags=["Company"])


def _not_found(ticker: str) -> HTTPException:
    """
    Builds the standard 404 response for an unknown ticker.

    Factored out since all seven Sprint 8 intelligence endpoints below
    need identical error-translation behavior for `CompanyNotFoundError`
    — keeping it in one place avoids seven copies of the same
    HTTPException construction drifting out of sync over time.
    """
    return HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Company not found for ticker '{ticker.upper()}'",
    )


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


@router.get(
    "/company/{ticker}/overview",
    response_model=CompanyOverviewResponse,
    summary="Get company SWOT overview",
    description="Returns a narrative summary and SWOT (strengths/weaknesses/"
    "opportunities/threats) analysis for the given ticker. Currently "
    "backed by mock data only.",
)
async def get_company_overview_endpoint(ticker: str) -> CompanyOverviewResponse:
    """
    Retrieve the intelligence overview for a given ticker symbol.

    Args:
        ticker: Stock ticker symbol, case-insensitive (e.g. "AAPL").

    Returns:
        CompanyOverviewResponse: Narrative summary and SWOT analysis.

    Raises:
        HTTPException: 404 if no overview exists for the ticker.
    """
    logger.debug(f"Company overview requested for ticker: {ticker}")
    try:
        return get_company_overview(ticker)
    except CompanyNotFoundError as exc:
        raise _not_found(ticker) from exc


@router.get(
    "/company/{ticker}/products",
    response_model=list[ProductResponse],
    summary="Get company product taxonomy",
    description="Returns key products/business lines for the given ticker. "
    "Currently backed by mock data only.",
)
async def get_company_products_endpoint(ticker: str) -> list[ProductResponse]:
    """
    Retrieve the product taxonomy for a given ticker symbol.

    Args:
        ticker: Stock ticker symbol, case-insensitive (e.g. "AAPL").

    Returns:
        list[ProductResponse]: Key products/business lines.

    Raises:
        HTTPException: 404 if no product data exists for the ticker.
    """
    logger.debug(f"Company products requested for ticker: {ticker}")
    try:
        return get_company_products(ticker)
    except CompanyNotFoundError as exc:
        raise _not_found(ticker) from exc


@router.get(
    "/company/{ticker}/financials",
    response_model=FinancialsResponse,
    summary="Get company financial statements",
    description="Returns income statement, balance sheet, and cash flow "
    "data for the given ticker. Currently backed by mock data only.",
)
async def get_company_financials_endpoint(ticker: str) -> FinancialsResponse:
    """
    Retrieve financial statements for a given ticker symbol.

    Args:
        ticker: Stock ticker symbol, case-insensitive (e.g. "AAPL").

    Returns:
        FinancialsResponse: Income statement, balance sheet, and cash
            flow line items.

    Raises:
        HTTPException: 404 if no financial data exists for the ticker.
    """
    logger.debug(f"Company financials requested for ticker: {ticker}")
    try:
        return get_company_financials(ticker)
    except CompanyNotFoundError as exc:
        raise _not_found(ticker) from exc


@router.get(
    "/company/{ticker}/competitors",
    response_model=list[CompetitorResponse],
    summary="Get company competitor benchmarking",
    description="Returns the company alongside key competitors with "
    "benchmarking metrics. Currently backed by mock data only.",
)
async def get_company_competitors_endpoint(ticker: str) -> list[CompetitorResponse]:
    """
    Retrieve competitor benchmarking data for a given ticker symbol.

    Args:
        ticker: Stock ticker symbol, case-insensitive (e.g. "AAPL").

    Returns:
        list[CompetitorResponse]: The company's row plus key competitors.

    Raises:
        HTTPException: 404 if no competitor data exists for the ticker.
    """
    logger.debug(f"Company competitors requested for ticker: {ticker}")
    try:
        return get_company_competitors(ticker)
    except CompanyNotFoundError as exc:
        raise _not_found(ticker) from exc


@router.get(
    "/company/{ticker}/news",
    response_model=list[NewsArticleResponse],
    summary="Get company news feed",
    description="Returns recent news articles about the given ticker. "
    "Currently backed by mock data only.",
)
async def get_company_news_endpoint(ticker: str) -> list[NewsArticleResponse]:
    """
    Retrieve recent news articles for a given ticker symbol.

    Args:
        ticker: Stock ticker symbol, case-insensitive (e.g. "AAPL").

    Returns:
        list[NewsArticleResponse]: Recent news articles.

    Raises:
        HTTPException: 404 if no news data exists for the ticker.
    """
    logger.debug(f"Company news requested for ticker: {ticker}")
    try:
        return get_company_news(ticker)
    except CompanyNotFoundError as exc:
        raise _not_found(ticker) from exc


@router.get(
    "/company/{ticker}/sentiment",
    response_model=SentimentResponse,
    summary="Get company sentiment monitoring scores",
    description="Returns aggregated and sub-channel (social, earnings "
    "call, employee) sentiment scores for the given ticker. Currently "
    "backed by mock data only.",
)
async def get_company_sentiment_endpoint(ticker: str) -> SentimentResponse:
    """
    Retrieve sentiment monitoring scores for a given ticker symbol.

    Args:
        ticker: Stock ticker symbol, case-insensitive (e.g. "AAPL").

    Returns:
        SentimentResponse: Aggregated and sub-channel sentiment scores.

    Raises:
        HTTPException: 404 if no sentiment data exists for the ticker.
    """
    logger.debug(f"Company sentiment requested for ticker: {ticker}")
    try:
        return get_company_sentiment(ticker)
    except CompanyNotFoundError as exc:
        raise _not_found(ticker) from exc


@router.get(
    "/company/{ticker}/forecast",
    response_model=list[ForecastResponse],
    summary="Get company forecast projections",
    description="Returns projected revenue, growth, and EBITDA by period "
    "for the given ticker. Currently backed by mock data only.",
)
async def get_company_forecast_endpoint(ticker: str) -> list[ForecastResponse]:
    """
    Retrieve forecast projections for a given ticker symbol.

    Args:
        ticker: Stock ticker symbol, case-insensitive (e.g. "AAPL").

    Returns:
        list[ForecastResponse]: Projected revenue/growth/EBITDA by period.

    Raises:
        HTTPException: 404 if no forecast data exists for the ticker.
    """
    logger.debug(f"Company forecast requested for ticker: {ticker}")
    try:
        return get_company_forecast(ticker)
    except CompanyNotFoundError as exc:
        raise _not_found(ticker) from exc
