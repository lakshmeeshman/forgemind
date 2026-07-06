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

Status (Sprint 8 - Company Intelligence APIs):
    Adds MOCK data for company intelligence sub-resources (overview,
    products, financials, competitors, news, sentiment, forecast) —
    see the "Company intelligence" section near the bottom of this
    file. These are independent of the live Yahoo Finance integration
    above and will be replaced by real ingestion pipelines in a future
    sprint without requiring changes to their public function
    signatures or response schemas.

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
from schemas.company import (
    CompanyOverviewResponse,
    CompanyResponse,
    CompetitorResponse,
    FinancialLineItem,
    FinancialsResponse,
    ForecastResponse,
    NewsArticleResponse,
    ProductResponse,
    SentimentResponse,
    SentimentScore,
)

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


# ----------------------------------------------------------------------
# Company intelligence (Sprint 8 - Company Intelligence APIs)
# ----------------------------------------------------------------------
# Everything below this point backs the /company/{ticker}/{overview,
# products, financials, competitors, news, sentiment, forecast}
# endpoints. It is intentionally independent of the live Yahoo Finance
# integration above: these are richer, synthesized intelligence
# products (SWOT analysis, competitor benchmarking, sentiment scoring,
# forecasting, etc.) that don't yet have a real backing data pipeline.
#
# Mock data is keyed by ticker and covers a small, curated set of
# companies. Unknown tickers raise CompanyNotFoundError, same as the
# live profile endpoint, keeping error-handling behavior consistent
# across the whole /company/{ticker}/... resource family.

_MOCK_OVERVIEWS: dict[str, CompanyOverviewResponse] = {
    "AAPL": CompanyOverviewResponse(
        ticker="AAPL",
        summary=(
            "Apple maintains a dominant position in premium consumer "
            "electronics, anchored by a tightly integrated hardware, "
            "software, and services ecosystem that drives strong "
            "customer retention and recurring revenue."
        ),
        strengths=[
            "Highly loyal installed customer base.",
            "Vertically integrated hardware/software/services ecosystem.",
            "Industry-leading brand value and pricing power.",
        ],
        weaknesses=[
            "Heavy revenue concentration in a single product line (iPhone).",
            "Premium pricing limits share in price-sensitive markets.",
        ],
        opportunities=[
            "Continued growth of high-margin Services revenue.",
            "Expansion of on-device AI features across the product line.",
        ],
        threats=[
            "Intensifying regulatory scrutiny over App Store practices globally.",
            "Slowing smartphone replacement cycles.",
        ],
    ),
    "MSFT": CompanyOverviewResponse(
        ticker="MSFT",
        summary=(
            "Microsoft's cloud and enterprise software franchises "
            "(Azure, Microsoft 365) continue to drive durable, "
            "high-margin growth, reinforced by an early and aggressive "
            "push into enterprise AI tooling."
        ),
        strengths=[
            "Market-leading enterprise cloud platform (Azure).",
            "Deeply embedded productivity software suite (Microsoft 365).",
            "Strong AI product integration across the portfolio.",
        ],
        weaknesses=[
            "Consumer hardware (Surface, Xbox) is a comparatively low-margin segment.",
            "Complex licensing model can create enterprise customer friction.",
        ],
        opportunities=[
            "Monetization of Copilot and generative AI features enterprise-wide.",
            "Continued cloud migration among traditional enterprises.",
        ],
        threats=[
            "Intense competition from AWS and Google Cloud.",
            "Antitrust scrutiny of AI/cloud bundling practices.",
        ],
    ),
    "TSLA": CompanyOverviewResponse(
        ticker="TSLA",
        summary=(
            "Tesla remains the volume leader in premium EVs, but faces "
            "increasing margin pressure as legacy automakers and Chinese "
            "manufacturers scale competing electric lineups."
        ),
        strengths=[
            "Strong brand and vertically integrated manufacturing.",
            "Extensive proprietary charging network.",
            "Early leadership in autonomous driving data collection.",
        ],
        weaknesses=[
            "High sensitivity to pricing/margin pressure from competitors.",
            "Limited model lineup relative to legacy automakers.",
        ],
        opportunities=[
            "Energy storage and grid-scale battery business growth.",
            "Robotaxi/autonomy monetization over the long term.",
        ],
        threats=[
            "Rapidly intensifying EV competition, especially from China.",
            "Regulatory and public scrutiny of driver-assist safety claims.",
        ],
    ),
    "NVDA": CompanyOverviewResponse(
        ticker="NVDA",
        summary=(
            "Nvidia is the dominant supplier of AI training and "
            "inference hardware, benefiting from a multi-year capital "
            "expenditure cycle among hyperscale cloud providers."
        ),
        strengths=[
            "Dominant share of the AI accelerator market.",
            "Deep software moat via the CUDA ecosystem.",
            "Strong relationships with every major hyperscaler.",
        ],
        weaknesses=[
            "High customer concentration among a small number of hyperscalers.",
            "Exposure to export control policy changes.",
        ],
        opportunities=[
            "Expansion into enterprise and sovereign AI infrastructure.",
            "Growth of edge/robotics compute demand.",
        ],
        threats=[
            "Custom silicon efforts by major cloud customers.",
            "Geopolitical export restrictions affecting key markets.",
        ],
    ),
}

_MOCK_PRODUCTS: dict[str, list[ProductResponse]] = {
    "AAPL": [
        ProductResponse(
            id="prod_aapl_1",
            name="iPhone",
            description="Flagship smartphone lineup.",
            market_share=42.0,
            revenue_segment="Consumer Hardware",
        ),
        ProductResponse(
            id="prod_aapl_2",
            name="Services",
            description="App Store, iCloud, Apple Music, AppleCare, and related subscriptions.",
            market_share=18.0,
            revenue_segment="Recurring Services",
        ),
    ],
    "MSFT": [
        ProductResponse(
            id="prod_msft_1",
            name="Azure",
            description="Enterprise cloud computing platform.",
            market_share=23.0,
            revenue_segment="Cloud Infrastructure",
        ),
        ProductResponse(
            id="prod_msft_2",
            name="Microsoft 365",
            description="Productivity and collaboration software suite.",
            market_share=31.0,
            revenue_segment="Enterprise Software",
        ),
    ],
    "TSLA": [
        ProductResponse(
            id="prod_tsla_1",
            name="Model Y / Model 3",
            description="Mass-market electric vehicle lineup.",
            market_share=15.0,
            revenue_segment="Automotive",
        ),
        ProductResponse(
            id="prod_tsla_2",
            name="Energy Storage",
            description="Megapack and Powerwall grid/home battery systems.",
            market_share=8.0,
            revenue_segment="Energy Generation & Storage",
        ),
    ],
    "NVDA": [
        ProductResponse(
            id="prod_nvda_1",
            name="Data Center GPUs",
            description="AI training and inference accelerators (H100/B200-class).",
            market_share=80.0,
            revenue_segment="Data Center",
        ),
        ProductResponse(
            id="prod_nvda_2",
            name="GeForce",
            description="Consumer gaming graphics cards.",
            market_share=88.0,
            revenue_segment="Gaming",
        ),
    ],
}

_MOCK_FINANCIALS: dict[str, FinancialsResponse] = {
    ticker: FinancialsResponse(
        ticker=ticker,
        years=["FY 2023", "FY 2024", "FY 2025"],
        income_statement=[
            FinancialLineItem(label="Total Revenue", is_total=True, values=values["revenue"]),
            FinancialLineItem(label="Cost of Revenue", is_total=False, values=values["cogs"]),
            FinancialLineItem(label="Gross Profit", is_total=True, values=values["gross_profit"]),
            FinancialLineItem(label="Operating Income", is_total=True, values=values["operating_income"]),
            FinancialLineItem(label="Net Income", is_total=True, values=values["net_income"]),
        ],
        balance_sheet=[
            FinancialLineItem(label="Cash & Equivalents", is_total=True, values=values["cash"]),
            FinancialLineItem(label="Total Assets", is_total=True, values=values["assets"]),
            FinancialLineItem(label="Total Liabilities", is_total=True, values=values["liabilities"]),
            FinancialLineItem(label="Shareholders Equity", is_total=True, values=values["equity"]),
        ],
        cash_flow=[
            FinancialLineItem(label="Operating Cash Flow", is_total=True, values=values["ocf"]),
            FinancialLineItem(label="Capital Expenditures", is_total=False, values=values["capex"]),
            FinancialLineItem(label="Free Cash Flow", is_total=True, values=values["fcf"]),
        ],
    )
    for ticker, values in {
        "AAPL": {
            "revenue": [383.3, 391.0, 416.2], "cogs": [214.1, 210.4, 221.0],
            "gross_profit": [169.2, 180.6, 195.2], "operating_income": [114.3, 123.2, 134.7],
            "net_income": [97.0, 101.9, 112.0], "cash": [29.9, 32.1, 35.4],
            "assets": [352.6, 364.9, 381.2], "liabilities": [290.4, 279.4, 275.0],
            "equity": [62.1, 85.5, 106.2], "ocf": [110.5, 118.3, 125.9],
            "capex": [-10.9, -11.5, -12.1], "fcf": [99.6, 106.8, 113.8],
        },
        "MSFT": {
            "revenue": [211.9, 245.1, 278.0], "cogs": [65.9, 74.1, 82.3],
            "gross_profit": [146.0, 171.0, 195.7], "operating_income": [88.5, 109.4, 128.5],
            "net_income": [72.4, 88.1, 101.8], "cash": [34.7, 30.0, 33.2],
            "assets": [411.9, 512.2, 560.6], "liabilities": [205.8, 243.7, 250.1],
            "equity": [206.2, 268.5, 310.5], "ocf": [87.6, 118.5, 130.2],
            "capex": [-28.1, -44.5, -55.0], "fcf": [59.5, 74.0, 75.2],
        },
        "TSLA": {
            "revenue": [96.8, 97.7, 104.5], "cogs": [79.1, 79.0, 83.6],
            "gross_profit": [17.7, 18.7, 20.9], "operating_income": [8.9, 7.1, 8.4],
            "net_income": [15.0, 7.9, 8.9], "cash": [16.4, 16.4, 18.1],
            "assets": [106.6, 122.1, 132.9], "liabilities": [43.0, 48.4, 50.9],
            "equity": [63.6, 73.7, 82.0], "ocf": [13.3, 14.9, 16.8],
            "capex": [-8.9, -11.3, -12.0], "fcf": [4.4, 3.6, 4.8],
        },
        "NVDA": {
            "revenue": [60.9, 130.5, 165.0], "cogs": [16.6, 32.6, 42.0],
            "gross_profit": [44.3, 97.9, 123.0], "operating_income": [32.9, 81.5, 102.0],
            "net_income": [29.8, 72.9, 91.0], "cash": [7.3, 8.6, 9.9],
            "assets": [65.7, 111.6, 140.2], "liabilities": [22.8, 32.3, 38.5],
            "equity": [42.9, 79.3, 101.7], "ocf": [28.1, 64.1, 80.5],
            "capex": [-1.1, -3.2, -4.5], "fcf": [27.0, 60.9, 76.0],
        },
    }.items()
}

_MOCK_COMPETITORS: dict[str, list[CompetitorResponse]] = {
    "AAPL": [
        CompetitorResponse(name="Apple Inc. (Target)", market_cap="$3,123.0B", pe_ratio="31.2", revenue_growth="6.1%", operating_margin="32.4%", rd_intensity="7.8%", debt_to_equity="1.45", is_target_company=True),
        CompetitorResponse(name="Samsung Electronics", market_cap="$385.0B", pe_ratio="12.4", revenue_growth="4.2%", operating_margin="11.8%", rd_intensity="9.1%", debt_to_equity="0.30"),
        CompetitorResponse(name="Alphabet Inc.", market_cap="$2,150.0B", pe_ratio="24.8", revenue_growth="10.5%", operating_margin="29.1%", rd_intensity="14.2%", debt_to_equity="0.10"),
    ],
    "MSFT": [
        CompetitorResponse(name="Microsoft Corporation (Target)", market_cap="$3,180.0B", pe_ratio="35.6", revenue_growth="13.4%", operating_margin="46.2%", rd_intensity="12.5%", debt_to_equity="0.35"),
        CompetitorResponse(name="Amazon.com, Inc.", market_cap="$1,980.0B", pe_ratio="42.1", revenue_growth="11.8%", operating_margin="9.8%", rd_intensity="11.3%", debt_to_equity="0.55"),
        CompetitorResponse(name="Alphabet Inc.", market_cap="$2,150.0B", pe_ratio="24.8", revenue_growth="10.5%", operating_margin="29.1%", rd_intensity="14.2%", debt_to_equity="0.10"),
    ],
    "TSLA": [
        CompetitorResponse(name="Tesla, Inc. (Target)", market_cap="$798.0B", pe_ratio="89.7", revenue_growth="0.9%", operating_margin="8.0%", rd_intensity="3.9%", debt_to_equity="0.17"),
        CompetitorResponse(name="BYD Company Ltd.", market_cap="$110.0B", pe_ratio="22.3", revenue_growth="29.0%", operating_margin="5.8%", rd_intensity="6.7%", debt_to_equity="0.52"),
        CompetitorResponse(name="Ford Motor Company", market_cap="$48.0B", pe_ratio="8.9", revenue_growth="3.1%", operating_margin="3.2%", rd_intensity="4.1%", debt_to_equity="2.85"),
    ],
    "NVDA": [
        CompetitorResponse(name="NVIDIA Corporation (Target)", market_cap="$3,180.0B", pe_ratio="42.5", revenue_growth="114.2%", operating_margin="61.8%", rd_intensity="12.9%", debt_to_equity="0.38"),
        CompetitorResponse(name="Advanced Micro Devices", market_cap="$265.0B", pe_ratio="45.2", revenue_growth="18.4%", operating_margin="14.1%", rd_intensity="25.6%", debt_to_equity="0.10"),
        CompetitorResponse(name="Intel Corporation", market_cap="$95.0B", pe_ratio="—", revenue_growth="-2.1%", operating_margin="-8.4%", rd_intensity="29.8%", debt_to_equity="0.62"),
    ],
}

_MOCK_NEWS: dict[str, list[NewsArticleResponse]] = {
    "AAPL": [
        NewsArticleResponse(
            id="news_aapl_1", title="Apple Expands On-Device AI Features Across Product Line",
            source="Reuters", url="https://reuters.com", published_at="2026-07-01T09:00:00Z",
            summary="Apple announced broader rollout of on-device AI capabilities across iPhone, iPad, and Mac.",
            sentiment="positive", impact_score=7,
        ),
        NewsArticleResponse(
            id="news_aapl_2", title="Regulators Scrutinize App Store Fee Structure in New Markets",
            source="Financial Times", url="https://ft.com", published_at="2026-06-28T14:30:00Z",
            summary="Regulators in additional jurisdictions have opened inquiries into Apple's App Store commission practices.",
            sentiment="negative", impact_score=5,
        ),
    ],
    "MSFT": [
        NewsArticleResponse(
            id="news_msft_1", title="Microsoft Reports Strong Azure Growth Driven by AI Workloads",
            source="Bloomberg", url="https://bloomberg.com", published_at="2026-07-02T13:00:00Z",
            summary="Azure revenue growth accelerated as enterprise customers scaled AI workloads on the platform.",
            sentiment="positive", impact_score=8,
        ),
    ],
    "TSLA": [
        NewsArticleResponse(
            id="news_tsla_1", title="Tesla Faces Pricing Pressure Amid Rising EV Competition",
            source="Forbes", url="https://forbes.com", published_at="2026-06-30T11:15:00Z",
            summary="Analysts note continued margin compression as Chinese EV makers expand into new markets.",
            sentiment="negative", impact_score=6,
        ),
    ],
    "NVDA": [
        NewsArticleResponse(
            id="news_nvda_1", title="Nvidia's Next-Gen AI Chips See Strong Early Hyperscaler Demand",
            source="Reuters", url="https://reuters.com", published_at="2026-07-03T08:45:00Z",
            summary="Early orders for Nvidia's newest data center GPUs indicate sustained AI infrastructure spend.",
            sentiment="positive", impact_score=9,
        ),
    ],
}

_MOCK_SENTIMENTS: dict[str, SentimentResponse] = {
    "AAPL": SentimentResponse(
        ticker="AAPL", positive=62, neutral=28, negative=10,
        social_sentiment=SentimentScore(score=58, label="Bullish Inflow"),
        earnings_call_sentiment=SentimentScore(score=68, label="Favorable Alignment"),
        employee_sentiment=SentimentScore(score=74, label="Strong Retention"),
    ),
    "MSFT": SentimentResponse(
        ticker="MSFT", positive=70, neutral=22, negative=8,
        social_sentiment=SentimentScore(score=65, label="Bullish Inflow"),
        earnings_call_sentiment=SentimentScore(score=75, label="Favorable Alignment"),
        employee_sentiment=SentimentScore(score=71, label="Strong Retention"),
    ),
    "TSLA": SentimentResponse(
        ticker="TSLA", positive=48, neutral=27, negative=25,
        social_sentiment=SentimentScore(score=52, label="Mixed Signals"),
        earnings_call_sentiment=SentimentScore(score=45, label="Cautious Tone"),
        employee_sentiment=SentimentScore(score=60, label="Moderate Retention"),
    ),
    "NVDA": SentimentResponse(
        ticker="NVDA", positive=78, neutral=17, negative=5,
        social_sentiment=SentimentScore(score=80, label="Strongly Bullish"),
        earnings_call_sentiment=SentimentScore(score=82, label="Highly Favorable"),
        employee_sentiment=SentimentScore(score=76, label="Strong Retention"),
    ),
}

_MOCK_FORECASTS: dict[str, list[ForecastResponse]] = {
    "AAPL": [
        ForecastResponse(year="2025", revenue=391.0, growth=2.0, ebitda=134.0, scenario="Base"),
        ForecastResponse(year="2026 (Proj)", revenue=416.2, growth=6.4, ebitda=145.0, scenario="Base"),
        ForecastResponse(year="2027 (Proj)", revenue=438.0, growth=5.2, ebitda=154.0, scenario="Base"),
    ],
    "MSFT": [
        ForecastResponse(year="2025", revenue=245.1, growth=15.7, ebitda=118.0, scenario="Base"),
        ForecastResponse(year="2026 (Proj)", revenue=278.0, growth=13.4, ebitda=136.0, scenario="Base"),
        ForecastResponse(year="2027 (Proj)", revenue=309.0, growth=11.1, ebitda=152.0, scenario="Base"),
    ],
    "TSLA": [
        ForecastResponse(year="2025", revenue=97.7, growth=0.9, ebitda=11.5, scenario="Base"),
        ForecastResponse(year="2026 (Proj)", revenue=104.5, growth=7.0, ebitda=13.2, scenario="Base"),
        ForecastResponse(year="2027 (Proj)", revenue=118.0, growth=12.9, ebitda=15.8, scenario="Base"),
    ],
    "NVDA": [
        ForecastResponse(year="2025", revenue=130.5, growth=114.2, ebitda=85.0, scenario="Base"),
        ForecastResponse(year="2026 (Proj)", revenue=165.0, growth=26.4, ebitda=108.0, scenario="Base"),
        ForecastResponse(year="2027 (Proj)", revenue=192.0, growth=16.4, ebitda=126.0, scenario="Base"),
    ],
}


def _ensure_company_exists(normalized_ticker: str) -> None:
    """
    Validates that a ticker corresponds to a real, tradable company by
    delegating to the live Yahoo Finance profile lookup.

    Why this exists (Sprint 9 - Intelligence Placeholder Behavior):
        Previously, each intelligence function below treated "not in
        our curated mock dataset" as equivalent to "ticker doesn't
        exist" and raised `CompanyNotFoundError` (-> 404) for both
        cases. That conflated two very different situations: a genuinely
        invalid ticker vs. a real company we simply haven't authored
        intelligence content for yet. This helper restores a single
        source of truth for ticker validity — the live profile lookup —
        so a valid ticker ALWAYS gets a well-formed response from every
        intelligence endpoint, even if that response is an empty
        placeholder.

    Args:
        normalized_ticker: Already-normalized (uppercase, trimmed)
            ticker symbol.

    Raises:
        CompanyNotFoundError: If the ticker does not correspond to a
            real, tradable company.
        CompanyDataUnavailableError: If the live market-data provider
            could not be reached.

    NOTE: This performs a live network call on every intelligence
    request (the same call `GET /company/{ticker}` makes). That's a
    deliberate trade-off for correctness/consistency per Sprint 9's
    requirements; a future optimization could cache validated tickers
    for a short TTL to avoid redundant lookups across the seven
    sub-resource endpoints in quick succession.

    NOTE: The `/company/{ticker}/{overview,products,...}` routes (see
    api/v1/company.py) currently only catch `CompanyNotFoundError`, not
    `CompanyDataUnavailableError` — that route-layer behavior was
    intentionally left unchanged per this task's scope ("only modify
    the intelligence service implementations"). If the live provider is
    down, these endpoints will currently surface as a generic 500
    rather than the 503 used by `/company/{ticker}` and
    `/reports/summary/{ticker}`. Extending those routes to also catch
    `CompanyDataUnavailableError` would be a small, separate follow-up.
    """
    get_company_by_ticker(normalized_ticker)


def _empty_overview(ticker: str) -> CompanyOverviewResponse:
    """Builds a valid, empty-content CompanyOverviewResponse placeholder."""
    return CompanyOverviewResponse(
        ticker=ticker,
        summary="Intelligence overview not yet available for this company.",
        strengths=[],
        weaknesses=[],
        opportunities=[],
        threats=[],
    )


def _empty_financials(ticker: str) -> FinancialsResponse:
    """Builds a valid, empty-content FinancialsResponse placeholder."""
    return FinancialsResponse(
        ticker=ticker,
        years=[],
        income_statement=[],
        balance_sheet=[],
        cash_flow=[],
    )


def _empty_sentiment(ticker: str) -> SentimentResponse:
    """Builds a valid, empty-content SentimentResponse placeholder."""
    unavailable = SentimentScore(score=0, label="No data available")
    return SentimentResponse(
        ticker=ticker,
        positive=0,
        neutral=0,
        negative=0,
        social_sentiment=unavailable,
        earnings_call_sentiment=unavailable,
        employee_sentiment=unavailable,
    )


def get_company_overview(ticker: str) -> CompanyOverviewResponse:
    """
    Look up the mock SWOT intelligence overview for a ticker.

    Args:
        ticker: Stock ticker symbol, case-insensitive.

    Returns:
        CompanyOverviewResponse: The curated overview if one exists, or
            an empty placeholder overview if the ticker is a valid
            company without curated intelligence content yet.

    Raises:
        CompanyNotFoundError: If the ticker does not correspond to a
            real, tradable company.
        CompanyDataUnavailableError: If the live market-data provider
            could not be reached while validating the ticker.
    """
    normalized_ticker = ticker.strip().upper()
    _ensure_company_exists(normalized_ticker)

    overview = _MOCK_OVERVIEWS.get(normalized_ticker)
    if overview is None:
        logger.info(
            f"No curated overview for valid ticker '{normalized_ticker}' — "
            "returning empty placeholder"
        )
        return _empty_overview(normalized_ticker)

    logger.debug(f"Overview lookup succeeded for ticker: {normalized_ticker}")
    return overview


def get_company_products(ticker: str) -> list[ProductResponse]:
    """
    Look up the mock product taxonomy for a ticker.

    Args:
        ticker: Stock ticker symbol, case-insensitive.

    Returns:
        list[ProductResponse]: The company's key products/business
            lines, or an empty list if the ticker is a valid company
            without curated product data yet.

    Raises:
        CompanyNotFoundError: If the ticker does not correspond to a
            real, tradable company.
        CompanyDataUnavailableError: If the live market-data provider
            could not be reached while validating the ticker.
    """
    normalized_ticker = ticker.strip().upper()
    _ensure_company_exists(normalized_ticker)

    products = _MOCK_PRODUCTS.get(normalized_ticker)
    if products is None:
        logger.info(
            f"No curated products for valid ticker '{normalized_ticker}' — "
            "returning empty list"
        )
        return []

    logger.debug(f"Products lookup succeeded for ticker: {normalized_ticker}")
    return products


def get_company_financials(ticker: str) -> FinancialsResponse:
    """
    Look up the mock financial statements for a ticker.

    Args:
        ticker: Stock ticker symbol, case-insensitive.

    Returns:
        FinancialsResponse: Income statement, balance sheet, and cash
            flow data for the company, or an empty placeholder if the
            ticker is a valid company without curated financial data
            yet.

    Raises:
        CompanyNotFoundError: If the ticker does not correspond to a
            real, tradable company.
        CompanyDataUnavailableError: If the live market-data provider
            could not be reached while validating the ticker.
    """
    normalized_ticker = ticker.strip().upper()
    _ensure_company_exists(normalized_ticker)

    financials = _MOCK_FINANCIALS.get(normalized_ticker)
    if financials is None:
        logger.info(
            f"No curated financials for valid ticker '{normalized_ticker}' — "
            "returning empty placeholder"
        )
        return _empty_financials(normalized_ticker)

    logger.debug(f"Financials lookup succeeded for ticker: {normalized_ticker}")
    return financials


def get_company_competitors(ticker: str) -> list[CompetitorResponse]:
    """
    Look up the mock competitor benchmarking table for a ticker.

    Args:
        ticker: Stock ticker symbol, case-insensitive.

    Returns:
        list[CompetitorResponse]: The company's row plus key
            competitors, or an empty list if the ticker is a valid
            company without curated competitor data yet.

    Raises:
        CompanyNotFoundError: If the ticker does not correspond to a
            real, tradable company.
        CompanyDataUnavailableError: If the live market-data provider
            could not be reached while validating the ticker.
    """
    normalized_ticker = ticker.strip().upper()
    _ensure_company_exists(normalized_ticker)

    competitors = _MOCK_COMPETITORS.get(normalized_ticker)
    if competitors is None:
        logger.info(
            f"No curated competitors for valid ticker '{normalized_ticker}' — "
            "returning empty list"
        )
        return []

    logger.debug(f"Competitors lookup succeeded for ticker: {normalized_ticker}")
    return competitors


def get_company_news(ticker: str) -> list[NewsArticleResponse]:
    """
    Look up the mock news feed for a ticker.

    Args:
        ticker: Stock ticker symbol, case-insensitive.

    Returns:
        list[NewsArticleResponse]: Recent news articles about the
            company, or an empty list if the ticker is a valid company
            without curated news data yet.

    Raises:
        CompanyNotFoundError: If the ticker does not correspond to a
            real, tradable company.
        CompanyDataUnavailableError: If the live market-data provider
            could not be reached while validating the ticker.
    """
    normalized_ticker = ticker.strip().upper()
    _ensure_company_exists(normalized_ticker)

    news = _MOCK_NEWS.get(normalized_ticker)
    if news is None:
        logger.info(
            f"No curated news for valid ticker '{normalized_ticker}' — "
            "returning empty list"
        )
        return []

    logger.debug(f"News lookup succeeded for ticker: {normalized_ticker}")
    return news


def get_company_sentiment(ticker: str) -> SentimentResponse:
    """
    Look up the mock sentiment monitoring scores for a ticker.

    Args:
        ticker: Stock ticker symbol, case-insensitive.

    Returns:
        SentimentResponse: Aggregated and sub-channel sentiment scores,
            or an empty/zeroed placeholder if the ticker is a valid
            company without curated sentiment data yet.

    Raises:
        CompanyNotFoundError: If the ticker does not correspond to a
            real, tradable company.
        CompanyDataUnavailableError: If the live market-data provider
            could not be reached while validating the ticker.
    """
    normalized_ticker = ticker.strip().upper()
    _ensure_company_exists(normalized_ticker)

    sentiment = _MOCK_SENTIMENTS.get(normalized_ticker)
    if sentiment is None:
        logger.info(
            f"No curated sentiment for valid ticker '{normalized_ticker}' — "
            "returning empty placeholder"
        )
        return _empty_sentiment(normalized_ticker)

    logger.debug(f"Sentiment lookup succeeded for ticker: {normalized_ticker}")
    return sentiment


def get_company_forecast(ticker: str) -> list[ForecastResponse]:
    """
    Look up the mock forecast projections for a ticker.

    Args:
        ticker: Stock ticker symbol, case-insensitive.

    Returns:
        list[ForecastResponse]: Projected revenue/growth/EBITDA by
            period, or an empty list if the ticker is a valid company
            without curated forecast data yet.

    Raises:
        CompanyNotFoundError: If the ticker does not correspond to a
            real, tradable company.
        CompanyDataUnavailableError: If the live market-data provider
            could not be reached while validating the ticker.
    """
    normalized_ticker = ticker.strip().upper()
    _ensure_company_exists(normalized_ticker)

    forecast = _MOCK_FORECASTS.get(normalized_ticker)
    if forecast is None:
        logger.info(
            f"No curated forecast for valid ticker '{normalized_ticker}' — "
            "returning empty list"
        )
        return []

    logger.debug(f"Forecast lookup succeeded for ticker: {normalized_ticker}")
    return forecast
