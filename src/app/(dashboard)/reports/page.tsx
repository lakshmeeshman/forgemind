"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Plus, Search, SlidersHorizontal, Sparkles } from "lucide-react";
import EmptyState from "@/components/dashboard/EmptyState";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("all");

  const tabs = [
    { id: "all", name: "All Documents" },
    { id: "swot", name: "SWOT Analyses" },
    { id: "competitors", name: "Competitor Audits" },
    { id: "financial", name: "Financial Trends" },
  ];

  const handleCompile = () => {
    alert("Report Compilation will be implemented in Sprint 6 - Reports.");
  };

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

      {/* Reports Listing - Empty State */}
      <div className="border border-white/[0.06] bg-white/[0.01] rounded-xl p-12 min-h-[400px] flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-grid-pattern opacity-10" />
        <div className="relative z-10 w-full max-w-md">
          <EmptyState
            icon={FileText}
            title={`No ${activeTab !== "all" ? tabs.find(t => t.id === activeTab)?.name : "reports"} compiled`}
            description="Generate customized PDF intelligence reports matching your specific company scan criteria."
            actionText="Compile Custom Brief"
            onActionClick={handleCompile}
          />
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
