/**
 * TypeScript Interfaces for ForgeMind API Layer
 */

export interface Company {
  id: string;
  name: string;
  ticker: string;
  slug: string;
  industry: string;
  headquarters: string;
  ceo: string;
  founded: number | string;
  marketCap: string;
  status: "Ingested" | "Processing" | "Failed" | "Standby";
}

export interface CompanyOverview {
  companyId: string;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface NewsArticle {
  id: string;
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  summary: string;
  sentiment: "positive" | "negative" | "neutral";
  impactScore: number; // Scale: 1-10
}

export interface Competitor {
  name: string;
  marketCap: string;
  peRatio: string;
  revenueGrowth: string;
  operatingMargin: string;
  rdIntensity: string;
  debtToEquity: string;
  isTargetCompany?: boolean;
}

export interface Forecast {
  year: string;
  revenue: number; // In Billions USD
  growth: number; // Percentage, e.g. 15.4 for 15.4%
  ebitda: number; // In Billions USD
  scenario: "Optimistic" | "Base" | "Pessimistic";
}

export interface ExecutiveSummary {
  companyId: string;
  compiledAt: string;
  compiledBy: string;
  briefing: string;
  riskScore: number; // Scale: 1-100
  recommendations: string[];
  signatures: {
    name: string;
    role: string;
  }[];
}

// Support interfaces for Products, Financials, and Sentiment
export interface Product {
  id: string;
  name: string;
  description: string;
  marketShare: number; // Percentage
  revenueSegment: string;
}

export interface FinancialRow {
  label: string;
  bold: boolean;
  values: number[]; // Array of values corresponding to years (e.g. 2023, 2024, 2025)
}

export interface FinancialStatement {
  companyId: string;
  years: string[];
  incomeStatement: FinancialRow[];
  balanceSheet: FinancialRow[];
  cashFlow: FinancialRow[];
}

export interface SentimentGauge {
  score: number; // Scale: -100 to +100 or percentage
  label: string;
}

export interface SentimentData {
  companyId: string;
  positive: number; // Percentage
  neutral: number; // Percentage
  negative: number; // Percentage
  socialSentiment: SentimentGauge;
  earningsCallSentiment: SentimentGauge;
  employeeSentiment: SentimentGauge;
}

// User credentials and session interfaces
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Analyst" | "Viewer";
  avatarUrl?: string;
}

export interface SavedReport {
  id: string;
  title: string;
  companyId: string;
  companyName: string;
  meta: string;
  date: string;
}
