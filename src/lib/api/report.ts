import { apiClient } from "./client";
import { ExecutiveSummary, SavedReport } from "./types";
import { MOCK_REPORTS, MOCK_SUMMARIES } from "./mockData";

// Session databases for reports (simulates DB mutations)
let sessionReports: SavedReport[] = [...MOCK_REPORTS];
const sessionSummaries: Record<string, ExecutiveSummary> = { ...MOCK_SUMMARIES };

export const reportApi = {
  // Fetch previously generated/saved reports list
  async getReports(): Promise<SavedReport[]> {
    return apiClient<SavedReport[]>("/reports", {
      mockData: sessionReports
    });
  },

  // Fetch the LangGraph executive summary for a company
  async getExecutiveSummary(slug: string): Promise<ExecutiveSummary> {
    const clean = slug.toLowerCase();
    const summary = sessionSummaries[clean];

    return apiClient<ExecutiveSummary>(`/reports/summary/${clean}`, {
      mockData: summary // Returns undefined if not compiled/scanned yet
    });
  },

  // Dispatches report compiler to build a PDF brief
  async compileReport(slug: string, companyName: string): Promise<SavedReport> {
    const clean = slug.toLowerCase();

    // Create a new compiled briefing in our session database if it does not exist
    if (!sessionSummaries[clean]) {
      sessionSummaries[clean] = {
        companyId: `co_${clean}`,
        compiledAt: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric"
        }),
        compiledBy: "LangGraph Agent - Orchestrator v1.8",
        briefing: `This document represents the official intelligence synthesis for ${companyName}. Our crawler dispatches parsed SEC reports and public filings. AI sentiment scoring suggests stable market positioning with low vulnerability indexes.`,
        riskScore: 35,
        recommendations: [
          "Establish secondary sourcing vendor channels to alleviate manufacturing centralization risk.",
          "Assess domestic pricing variations to counter discount models."
        ],
        signatures: [
          { name: "Alpha_Crawler_Agent", role: "SEC Document Parser" },
          { name: "Synthesis_Review_Agent", role: "Lead Reasoning Model" }
        ]
      };
    }

    const newReport: SavedReport = {
      id: `rep_${clean}_${Date.now()}`,
      title: `${companyName} Compiled Intelligence Brief`,
      companyId: `co_${clean}`,
      companyName: companyName,
      meta: "PDF • 1.5MB • Synthesized by Alex Mercer",
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      })
    };

    // Add to reports list
    sessionReports = [newReport, ...sessionReports];

    return apiClient<SavedReport>(`/reports/compile`, {
      method: "POST",
      body: JSON.stringify({ slug, companyName }),
      mockData: newReport
    });
  }
};
