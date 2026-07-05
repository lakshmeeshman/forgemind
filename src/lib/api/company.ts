import { apiClient } from "./client";
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

export const companyApi = {
  // Fetch all tracked company profiles
  async getCompanies(): Promise<Company[]> {
    const list = Object.values(sessionCompanies);
    return apiClient<Company[]>("/company", {
      mockData: list
    });
  },

  // Fetch a single company profile by slug
  async getCompanyBySlug(slug: string): Promise<Company> {
    const clean = slug.toLowerCase();
    
    // Simulate error testing slug
    if (clean === "error-state") {
      return apiClient<Company>(`/company/${clean}/error-state`, {
        useMock: true
      });
    }

    const company = sessionCompanies[clean] || generateDynamicCompany(clean);
    return apiClient<Company>(`/company/${clean}`, {
      mockData: company
    });
  },

  // Fetch company SWOT overview
  async getCompanyOverview(slug: string): Promise<CompanyOverview> {
    const clean = slug.toLowerCase();
    const data = sessionOverviews[clean];
    
    return apiClient<CompanyOverview>(`/company/${clean}/overview`, {
      mockData: data // Undefined if not ingested yet
    });
  },

  // Fetch company product taxonomy
  async getCompanyProducts(slug: string): Promise<Product[]> {
    const clean = slug.toLowerCase();
    const data = sessionProducts[clean];
    
    return apiClient<Product[]>(`/company/${clean}/products`, {
      mockData: data
    });
  },

  // Fetch company financial statements (Income, Balance, Cash Flow)
  async getCompanyFinancials(slug: string): Promise<FinancialStatement> {
    const clean = slug.toLowerCase();
    const data = sessionFinancials[clean];
    
    return apiClient<FinancialStatement>(`/company/${clean}/financials`, {
      mockData: data
    });
  },

  // Fetch company competitors table
  async getCompanyCompetitors(slug: string): Promise<Competitor[]> {
    const clean = slug.toLowerCase();
    const data = sessionCompetitors[clean];
    
    return apiClient<Competitor[]>(`/company/${clean}/competitors`, {
      mockData: data
    });
  },

  // Fetch company news feed
  async getCompanyNews(slug: string): Promise<NewsArticle[]> {
    const clean = slug.toLowerCase();
    const data = sessionNews[clean];
    
    return apiClient<NewsArticle[]>(`/company/${clean}/news`, {
      mockData: data
    });
  },

  // Fetch company sentiment monitoring scores
  async getCompanySentiment(slug: string): Promise<SentimentData> {
    const clean = slug.toLowerCase();
    const data = sessionSentiments[clean];
    
    return apiClient<SentimentData>(`/company/${clean}/sentiment`, {
      mockData: data
    });
  },

  // Fetch company forecast projections
  async getCompanyForecast(slug: string): Promise<Forecast[]> {
    const clean = slug.toLowerCase();
    const data = sessionForecasts[clean];
    
    return apiClient<Forecast[]>(`/company/${clean}/forecast`, {
      mockData: data
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
