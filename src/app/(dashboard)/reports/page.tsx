"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Plus, Search, SlidersHorizontal, Sparkles, Download, AlertCircle, RefreshCw } from "lucide-react";
import EmptyState from "@/components/dashboard/EmptyState";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { reportApi, SavedReport } from "@/lib/api";

const ReportSkeleton = () => (
  <div className="space-y-3">
    {[1, 2].map((i) => (
      <div key={i} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 rounded-xl border border-white/[0.04] bg-white/[0.01] animate-pulse">
        <div className="space-y-2">
          <div className="h-3.5 w-48 bg-slate-800 rounded" />
          <div className="h-2.5 w-64 bg-slate-800/60 rounded" />
        </div>
        <div className="h-8 w-8 bg-slate-800 rounded-lg sm:mt-0 mt-3" />
      </div>
    ))}
  </div>
);

const ErrorState = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <div className="p-8 rounded-xl border border-red-500/20 bg-red-950/5 text-center space-y-4 max-w-md mx-auto">
    <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
      <AlertCircle className="w-5 h-5 text-red-400" />
    </div>
    <div className="space-y-1">
      <h4 className="text-sm font-bold text-red-200">Failed to Retrieve Briefings</h4>
      <p className="text-xs text-slate-400">{message}</p>
    </div>
    <Button
      onClick={onRetry}
      size="sm"
      className="bg-red-950/20 hover:bg-red-900/30 border border-red-500/30 text-red-300 cursor-pointer text-xs"
    >
      <RefreshCw className="w-3.5 h-3.5 mr-1" />
      Retry
    </Button>
  </div>
);

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [reports, setReports] = useState<SavedReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const loadReports = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await reportApi.getReports();
      setReports(data);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Failed to fetch saved document index.";
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const tabs = [
    { id: "all", name: "All Documents" },
    { id: "swot", name: "SWOT Analyses" },
    { id: "competitors", name: "Competitor Audits" },
    { id: "financial", name: "Financial Trends" },
  ];

  const handleCompile = () => {
    alert("Report compilation will invoke the LangGraph compiler. Dispatches can be run from the Company Workspace pages.");
  };

  const filteredReports = reports.filter((report) => {
    // Filter by search query
    const matchesSearch =
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.companyName.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    // Filter by tab
    if (activeTab === "all") return true;
    if (activeTab === "swot") return report.title.toLowerCase().includes("intelligence") || report.title.toLowerCase().includes("swot");
    if (activeTab === "competitors") return report.title.toLowerCase().includes("competitor") || report.title.toLowerCase().includes("vs");
    if (activeTab === "financial") return report.title.toLowerCase().includes("financial") || report.title.toLowerCase().includes("revenue");
    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 pb-12 text-white"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Executive <span className="bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">Reports</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Access, compile, and download publication-ready corporate intelligence briefs.
          </p>
        </div>
        <Button
          onClick={handleCompile}
          className="bg-brand-primary hover:bg-brand-primary/95 text-white font-medium text-xs h-9 px-4 cursor-pointer inline-flex items-center gap-1.5 shadow-lg shadow-brand-primary/25"
        >
          <Plus className="w-3.5 h-3.5" />
          Compile Report
        </Button>
      </div>

      {/* Tabs & Search controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-1.5 bg-white/[0.02] border border-white/[0.06] p-1 rounded-lg w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer select-none",
                activeTab === tab.id
                  ? "bg-white/[0.04] border border-white/[0.08] text-brand-accent"
                  : "text-slate-400 hover:text-slate-200"
              )}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Search Input and Filters */}
        <div className="flex items-center gap-2 max-w-sm w-full md:w-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white/[0.01] border border-white/[0.06] rounded-lg outline-none text-slate-300 placeholder-slate-500 hover:border-white/10 focus:border-brand-primary transition-colors"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/5 cursor-pointer h-8 px-2.5 text-xs inline-flex items-center gap-1"
          >
            <SlidersHorizontal className="w-3 h-3" />
            Sort
          </Button>
        </div>
      </div>

      {/* Reports Listing */}
      <div className="border border-white/[0.06] bg-white/[0.01] rounded-xl p-6 min-h-[400px] flex flex-col justify-center relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-grid-pattern opacity-10" />
        <div className="relative z-10 w-full">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ReportSkeleton />
              </motion.div>
            ) : error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ErrorState message={error} onRetry={loadReports} />
              </motion.div>
            ) : filteredReports.length > 0 ? (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                {filteredReports.map((report) => (
                  <div
                    key={report.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 rounded-xl border border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.02] hover:border-white/[0.08] transition-all gap-4"
                  >
                    <div>
                      <h4 className="text-xs font-semibold text-slate-200">{report.title}</h4>
                      <p className="text-[10px] text-slate-400 mt-1">{report.meta}</p>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-0 border-white/[0.06] pt-3 sm:pt-0">
                      <span className="text-[10px] text-slate-500 font-medium sm:hidden">
                        {report.date}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium hidden sm:inline mr-2">
                        {report.date}
                      </span>
                      <Button
                        variant="outline"
                        size="icon-sm"
                        className="border-white/10 hover:bg-white/5 text-slate-400 hover:text-white cursor-pointer"
                        onClick={() => alert(`Downloading brief for ${report.companyName} is prepared. (FastAPI Sprint 6)`)}
                      >
                        <Download className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-md mx-auto"
              >
                <EmptyState
                  icon={FileText}
                  title={`No ${activeTab !== "all" ? tabs.find(t => t.id === activeTab)?.name : "reports"} compiled`}
                  description="Generate customized PDF intelligence reports matching your specific company scan criteria."
                  actionText="Compile Custom Brief"
                  onActionClick={handleCompile}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Pro tip card */}
      <div className="p-4 rounded-xl border border-white/[0.06] bg-gradient-to-r from-white/[0.02] to-transparent flex gap-3.5">
        <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.08] flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4 text-brand-accent" />
        </div>
        <div>
          <h4 className="text-xs font-semibold text-slate-200">Formatting and Exports:</h4>
          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
            All compiled summaries are generated in publication-grade format, with vector graphs and cited source footnotes. You can export them as PDF, raw markdown, or share securely with colleagues using secure access codes.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
