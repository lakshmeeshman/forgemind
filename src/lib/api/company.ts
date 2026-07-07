import { apiClient, USE_MOCK_API } from "./client";
import {
  Company,
  CompanyOverview,
  Product,
  FinancialStatement,
  Competitor,
  NewsArticle,
  SentimentData,
  Forecast
} from "./types";
import {
  MOCK_COMPANIES,
  MOCK_OVERVIEWS,
  MOCK_PRODUCTS,
  MOCK_FINANCIALS,
  MOCK_COMPETITORS,
  MOCK_NEWS,
  MOCK_SENTIMENTS,
  MOCK_FORECASTS
} from "./mockData";

// Helper to generate dynamic mock data for new companies scanned by the user
function generateDynamicCompany(slug: string): Company {
  const clean = slug.trim().toLowerCase();
  const name = clean.charAt(0).toUpperCase() + clean.slice(1) + " Corp.";
  const ticker = (clean.substring(0, 4).toUpperCase());
  return {
    id: `co_${clean}`,
    name,
    ticker,
    slug: clean,
    industry: "Technology & Professional Services",
    headquarters: "New York, NY",
    ceo: "Executive Director",
    founded: 2012,
    marketCap: "$120.0 Billion",
    status: "Standby" // Scans will change it to Ingested
  };
}

// Global state in-memory database to store newly scanned companies during the session
// (Simulates a real DB updates in FastAPI)
const sessionCompanies: Record<string, Company> = { ...MOCK_COMPANIES };
const sessionOverviews: Record<string, CompanyOverview> = { ...MOCK_OVERVIEWS };
const sessionProducts: Record<string, Product[]> = { ...MOCK_PRODUCTS };
const sessionFinancials: Record<string, FinancialStatement> = { ...MOCK_FINANCIALS };
const sessionCompetitors: Record<string, Competitor[]> = { ...MOCK_COMPETITORS };
const sessionNews: Record<string, NewsArticle[]> = { ...MOCK_NEWS };
const sessionSentiments: Record<string, SentimentData> = { ...MOCK_SENTIMENTS };
const sessionForecasts: Record<string, Forecast[]> = { ...MOCK_FORECASTS };

// ----------------------------------------------------------------------
// Live backend integration (Sprint 9 — Company Overview)
// ----------------------------------------------------------------------

/**
 * Shape returned by the live FastAPI endpoint:
 * GET /api/v1/company/{ticker}/overview
 * Mirrors backend/schemas/company.py -> CompanyOverviewResponse.
 *
 * Kept local to this file (not exported, not added to types.ts) since
 * it's an internal wire format — it gets adapted into our existing
 * `CompanyOverview` type below via mapOverviewResponseToCompanyOverview().
 * Consumers of companyApi should never see this shape directly.
 */
interface CompanyOverviewApiResponse {
  ticker: string;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

/**
 * Maps our internal, URL-friendly company slugs (used by the Company
 * page routes, e.g. /company/apple) to the real stock ticker symbols
 * the live FastAPI backend expects (GET /company/{ticker}/...).
 *
 * This is the ONLY place that mapping lives. Add new companies here as
 * they're wired up to live data — this list does not need to (and
 * should not) match MOCK_COMPANIES exactly, since not every mock/demo
 * company corresponds to a real, tradable ticker.
 */
const SLUG_TO_TICKER: Record<string, string> = {
  apple: "AAPL",
  nvidia: "NVDA",
  tesla: "TSLA"
};

/**
 * Resolves the real ticker symbol to query the live backend with, for
 * a given company slug.
 *
 * Resolution order:
 *   1. `SLUG_TO_TICKER` — explicit, known-good mapping for companies
 *      we've verified have real, tradable tickers.
 *   2. `fallback.ticker` — whatever ticker is already attached to the
 *      company in session/mock state (covers dynamically-scanned
 *      companies). Not guaranteed to be a real ticker the backend
 *      recognizes — an unmapped, made-up slug will simply 404 against
 *      the live API, which callers should treat as a genuine
 *      "not found" rather than falling back to fabricated data.
 */
function resolveTicker(slug: string, fallback: Company): string {
  return SLUG_TO_TICKER[slug] ?? fallback.ticker;
}

/**
 * Adapts a live backend CompanyOverviewApiResponse into our existing
 * frontend `CompanyOverview` shape.
 *
 * The backend keys its overview by `ticker`; our frontend type keys it
 * by `companyId` (matching how `Company` and other intelligence types
 * are already linked in this codebase). `companyId` is carried over
 * from the already-resolved `Company` record rather than the response,
 * since the backend has no concept of our internal company id.
 */
function mapOverviewResponseToCompanyOverview(
  response: CompanyOverviewApiResponse,
  companyId: string
): CompanyOverview {
  return {
    companyId,
    summary: response.summary,
    strengths: response.strengths,
    weaknesses: response.weaknesses,
    opportunities: response.opportunities,
    threats: response.threats
  };
}

export const companyApi = {
  // Fetch all tracked company profiles
  // NOTE: the backend does not yet expose a "list companies" endpoint
  // (only GET /company/{ticker} exists as of Sprint 7), so this remains
  // mock-backed until that endpoint is implemented.
  async getCompanies(): Promise<Company[]> {
    const list = Object.values(sessionCompanies);
    return apiClient<Company[]>("/company", {
      mockData: list
    });
  },

  // Fetch a single company profile by slug
  async getCompanyBySlug(slug: string): Promise<Company> {
    const clean = slug.toLowerCase();

    // Simulate error testing slug (mock-only sentinel, unaffected by
    // USE_MOCK_API — kept for UI error-boundary testing regardless of mode)
    if (clean === "error-state") {
      return apiClient<Company>(`/company/${clean}/error-state`, {
        useMock: true
      });
    }

    const fallback = sessionCompanies[clean] || generateDynamicCompany(clean);

    // Mock mode: unchanged prototyping behavior from Sprint 6.
    if (USE_MOCK_API) {
      return apiClient<Company>(`/company/${clean}`, {
        mockData: fallback
      });
    }

    // Live mode (Sprint 9): query the real FastAPI Company API.
    // The backend endpoint is ticker-based (GET /company/{ticker}),
    // while the Company page routes on `slug` — so we resolve the slug
    // to its real ticker via SLUG_TO_TICKER before calling out. Unknown
    // tickers surface as a thrown Error (404 "Company not found..."
    // from the backend, or a network/server error) — callers should
    // handle that as a genuine "not found" state rather than falling
    // back to fabricated data.
    const ticker = resolveTicker(clean, fallback);

    const live = await apiClient<{
      ticker: string;
      name: string;
      sector: string;
      industry: string;
      market_cap: number;
      current_price: number;
      currency: string;
    }>(`/company/${ticker}`, { useMock: false });

    const formatMarketCap = (value: number, currency: string): string => {
      const prefix = currency === "USD" ? "$" : `${currency} `;
      if (value >= 1_000_000_000_000) return `${prefix}${(value / 1_000_000_000_000).toFixed(2)} Trillion`;
      if (value >= 1_000_000_000) return `${prefix}${(value / 1_000_000_000).toFixed(1)} Billion`;
      if (value >= 1_000_000) return `${prefix}${(value / 1_000_000).toFixed(1)} Million`;
      return `${prefix}${value.toLocaleString()}`;
    };

    const company: Company = {
      ...fallback,
      slug: clean,
      ticker: live.ticker,
      name: live.name,
      industry: live.industry,
      marketCap: formatMarketCap(live.market_cap, live.currency),
      status: "Ingested"
    };

    // Cache the freshly-fetched company in session state, mirroring how
    // scanCompany() persists ingested companies below.
    sessionCompanies[clean] = company;

    return company;
  },

  // Fetch company SWOT overview
  async getCompanyOverview(slug: string): Promise<CompanyOverview> {
    const clean = slug.toLowerCase();
    const fallback = sessionCompanies[clean] || generateDynamicCompany(clean);

    // Mock mode: unchanged prototyping behavior from Sprint 6.
    if (USE_MOCK_API) {
      const data = sessionOverviews[clean];
      return apiClient<CompanyOverview>(`/company/${clean}/overview`, {
        mockData: data // Undefined if not ingested yet
      });
    }

    // Live mode (Sprint 9 - Phase 1): query the real FastAPI endpoint,
    // GET /company/{ticker}/overview. As with getCompanyBySlug, the
    // slug is resolved to its real ticker via SLUG_TO_TICKER first.
    // Per the backend's Sprint 9 contract, a valid ticker always
    // returns a well-formed overview (possibly with empty
    // strengths/weaknesses/opportunities/threats arrays if the backend
    // has no curated content yet) — only a genuinely invalid ticker
    // throws (404 "Company not found..." from the backend, or a
    // network/server error).
    const ticker = resolveTicker(clean, fallback);

    const live = await apiClient<CompanyOverviewApiResponse>(
      `/company/${ticker}/overview`,
      { useMock: false }
    );

    const overview = mapOverviewResponseToCompanyOverview(live, fallback.id);

    // Cache the freshly-fetched overview in session state, mirroring
    // how getCompanyBySlug() and scanCompany() persist fetched data.
    sessionOverviews[clean] = overview;

    return overview;
  },

  // Fetch company product taxonomy
  async getCompanyProducts(slug: string): Promise<Product[]> {
    const clean = slug.toLowerCase();
    const data = sessionProducts[clean];

    // Mock mode: unchanged prototyping behavior from Sprint 6.
    if (USE_MOCK_API) {
      return apiClient<Product[]>(`/company/${clean}/products`, {
        mockData: data
      });
    }

    // Live mode (Sprint 9 - Phase 2): resolve slug -> ticker exactly
    // like getCompanyOverview() does, since the backend endpoint is
    // ticker-based (GET /company/{ticker}/products), not slug-based.
    const fallback = sessionCompanies[clean] || generateDynamicCompany(clean);
    const ticker = resolveTicker(clean, fallback);

    return apiClient<Product[]>(`/company/${ticker}/products`, {
      useMock: false
    });
  },

  // Fetch company financial statements (Income, Balance, Cash Flow)
  async getCompanyFinancials(slug: string): Promise<FinancialStatement> {
    const clean = slug.toLowerCase();
    const data = sessionFinancials[clean];

    // Mock mode: unchanged prototyping behavior from Sprint 6.
    if (USE_MOCK_API) {
      return apiClient<FinancialStatement>(`/company/${clean}/financials`, {
        mockData: data
      });
    }

    // Live mode (Sprint 9 - Phase 2): resolve slug -> ticker exactly
    // like getCompanyOverview() does, since the backend endpoint is
    // ticker-based (GET /company/{ticker}/financials), not slug-based.
    const fallback = sessionCompanies[clean] || generateDynamicCompany(clean);
    const ticker = resolveTicker(clean, fallback);

    return apiClient<FinancialStatement>(`/company/${ticker}/financials`, {
      useMock: false
    });
  },

  // Fetch company competitors table
  async getCompanyCompetitors(slug: string): Promise<Competitor[]> {
    const clean = slug.toLowerCase();
    const data = sessionCompetitors[clean];

    // Mock mode: unchanged prototyping behavior from Sprint 6.
    if (USE_MOCK_API) {
      return apiClient<Competitor[]>(`/company/${clean}/competitors`, {
        mockData: data
      });
    }

    // Live mode (Sprint 9 - Phase 2): resolve slug -> ticker exactly
    // like getCompanyOverview() does, since the backend endpoint is
    // ticker-based (GET /company/{ticker}/competitors), not slug-based.
    const fallback = sessionCompanies[clean] || generateDynamicCompany(clean);
    const ticker = resolveTicker(clean, fallback);

    return apiClient<Competitor[]>(`/company/${ticker}/competitors`, {
      useMock: false
    });
  },

  // Fetch company news feed
  async getCompanyNews(slug: string): Promise<NewsArticle[]> {
    const clean = slug.toLowerCase();
    const data = sessionNews[clean];

    // Mock mode: unchanged prototyping behavior from Sprint 6.
    if (USE_MOCK_API) {
      return apiClient<NewsArticle[]>(`/company/${clean}/news`, {
        mockData: data
      });
    }

    // Live mode (Sprint 9 - Phase 2): resolve slug -> ticker exactly
    // like getCompanyOverview() does, since the backend endpoint is
    // ticker-based (GET /company/{ticker}/news), not slug-based.
    const fallback = sessionCompanies[clean] || generateDynamicCompany(clean);
    const ticker = resolveTicker(clean, fallback);

    return apiClient<NewsArticle[]>(`/company/${ticker}/news`, {
      useMock: false
    });
  },

  // Fetch company sentiment monitoring scores
  async getCompanySentiment(slug: string): Promise<SentimentData> {
    const clean = slug.toLowerCase();
    const data = sessionSentiments[clean];

    // Mock mode: unchanged prototyping behavior from Sprint 6.
    if (USE_MOCK_API) {
      return apiClient<SentimentData>(`/company/${clean}/sentiment`, {
        mockData: data
      });
    }

    // Live mode (Sprint 9 - Phase 2): resolve slug -> ticker exactly
    // like getCompanyOverview() does, since the backend endpoint is
    // ticker-based (GET /company/{ticker}/sentiment), not slug-based.
    const fallback = sessionCompanies[clean] || generateDynamicCompany(clean);
    const ticker = resolveTicker(clean, fallback);

    return apiClient<SentimentData>(`/company/${ticker}/sentiment`, {
      useMock: false
    });
  },

  // Fetch company forecast projections
  async getCompanyForecast(slug: string): Promise<Forecast[]> {
    const clean = slug.toLowerCase();
    const data = sessionForecasts[clean];

    // Mock mode: unchanged prototyping behavior from Sprint 6.
    if (USE_MOCK_API) {
      return apiClient<Forecast[]>(`/company/${clean}/forecast`, {
        mockData: data
      });
    }

    // Live mode (Sprint 9 - Phase 2): resolve slug -> ticker exactly
    // like getCompanyOverview() does, since the backend endpoint is
    // ticker-based (GET /company/{ticker}/forecast), not slug-based.
    const fallback = sessionCompanies[clean] || generateDynamicCompany(clean);
    const ticker = resolveTicker(clean, fallback);

    return apiClient<Forecast[]>(`/company/${ticker}/forecast`, {
      useMock: false
    });
  },

  // Dispatches crawl pipeline scan for standby company profiles
  async scanCompany(slug: string): Promise<Company> {
    const clean = slug.toLowerCase();

    // Trigger error state test
    if (clean === "error-state") {
      return apiClient<Company>(`/company/${clean}/scan/error-state`, {
        useMock: true
      });
    }

    // Set company to "Ingested" state in our session DB and generate full synthesized data
    const existing = sessionCompanies[clean] || generateDynamicCompany(clean);

    const updatedCompany: Company = {
      ...existing,
      status: "Ingested"
    };

    // Store in session
    sessionCompanies[clean] = updatedCompany;

    // Create synthetic intelligence data for this new company if it does not have it yet
    if (!sessionOverviews[clean]) {
      sessionOverviews[clean] = {
        companyId: updatedCompany.id,
        summary: `Synthesized intelligence report for ${updatedCompany.name}. Ingestion pipelines crawled earnings logs, SEC Edgar libraries, and media reports.`,
        strengths: ["Strong global market alignment.", "High scalability potential in core sector.", "Active technology modernization roadmap."],
        weaknesses: ["Elevated compliance overhead.", "Moderate marketing operational cost structure."],
        opportunities: ["Expansion of cloud operations in emerging markets.", "Integration of advanced artificial intelligence automation."],
        threats: ["Regulatory antitrust policy variations globally.", "Fierce talent acquisition competition in primary regions."]
      };

      sessionProducts[clean] = [
        { id: `prod_${clean}_1`, name: "Core Platform Service", description: "Flagship enterprise application suite.", marketShare: 42, revenueSegment: "Enterprise Software" },
        { id: `prod_${clean}_2`, name: "Consulting Operations", description: "Bespoke systems engineering services.", marketShare: 15, revenueSegment: "Professional Services" }
      ];

      sessionFinancials[clean] = {
        companyId: updatedCompany.id,
        years: ["FY 2023", "FY 2024", "FY 2025"],
        incomeStatement: [
          { label: "Total Revenue", bold: true, values: [95.0, 108.0, 120.0] },
          { label: "Cost of Revenue", bold: false, values: [40.0, 42.0, 45.0] },
          { label: "Gross Profit", bold: true, values: [55.0, 66.0, 75.0] },
          { label: "Operating Income", bold: true, values: [15.0, 20.0, 28.0] },
          { label: "Net Income", bold: true, values: [10.0, 14.0, 21.0] }
        ],
        balanceSheet: [
          { label: "Cash & Equivalents", bold: true, values: [12.0, 18.0, 24.5] },
          { label: "Total Assets", bold: true, values: [45.0, 52.0, 68.0] },
          { label: "Total Liabilities", bold: true, values: [20.0, 22.0, 28.0] },
          { label: "Shareholders Equity", bold: true, values: [25.0, 30.0, 40.0] }
        ],
        cashFlow: [
          { label: "Operating Cash Flow", bold: true, values: [14.0, 19.0, 26.0] },
          { label: "Capital Expenditures", bold: false, values: [-4.0, -5.0, -6.5] },
          { label: "Free Cash Flow", bold: true, values: [10.0, 14.0, 19.5] }
        ]
      };

      sessionCompetitors[clean] = [
        { name: `${updatedCompany.name} (Target)`, marketCap: "$120.0B", peRatio: "25.0", revenueGrowth: "11.1%", operatingMargin: "23.3%", rdIntensity: "8.5%", debtToEquity: "0.70", isTargetCompany: true },
        { name: "Global Rival A", marketCap: "$145.0B", peRatio: "28.5", revenueGrowth: "8.2%", operatingMargin: "18.4%", rdIntensity: "9.2%", debtToEquity: "0.45" },
        { name: "Global Rival B", marketCap: "$90.0B", peRatio: "18.2", revenueGrowth: "14.5%", operatingMargin: "12.0%", rdIntensity: "5.5%", debtToEquity: "0.90" }
      ];

      sessionNews[clean] = [
        {
          id: `news_${clean}_1`,
          title: `${updatedCompany.name} Expands Strategic Alliance with Cloud Providers`,
          source: "Forbes",
          url: "https://forbes.com",
          publishedAt: "Just now",
          summary: `The tech organization announced a new collaboration focusing on scaling deep learning models in multi-tenant environments.`,
          sentiment: "positive",
          impactScore: 8
        }
      ];

      sessionSentiments[clean] = {
        companyId: updatedCompany.id,
        positive: 65,
        neutral: 25,
        negative: 10,
        socialSentiment: { score: 55, label: "Bullish Inflow" },
        earningsCallSentiment: { score: 70, label: "Favorable Alignment" },
        employeeSentiment: { score: 78, label: "Strong Retention" }
      };

      sessionForecasts[clean] = [
        { year: "2024", revenue: 108.0, growth: 13.6, ebitda: 25.0, scenario: "Base" },
        { year: "2025 (Proj)", revenue: 120.0, growth: 11.1, ebitda: 28.0, scenario: "Base" },
        { year: "2026 (Proj)", revenue: 134.0, growth: 11.6, ebitda: 31.5, scenario: "Base" },
        { year: "2027 (Proj)", revenue: 148.0, growth: 10.4, ebitda: 35.0, scenario: "Base" }
      ];
    }

    return apiClient<Company>(`/company/${clean}/scan`, {
      method: "POST",
      mockData: updatedCompany
    });
  }
};