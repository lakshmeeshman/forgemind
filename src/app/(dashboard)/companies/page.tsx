"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Building2, Search, Filter, Sparkles, Plus, Compass } from "lucide-react";
import EmptyState from "@/components/dashboard/EmptyState";
import { Button } from "@/components/ui/button";

export default function CompaniesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleScan = () => {
    alert("Real-time AI Company Scan will be implemented in Sprint 3 - Company Intelligence.");
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
            Companies <span className="bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">Intelligence</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Search, analyze, and track public profiles of corporate entities.
          </p>
        </div>
        <Button
          onClick={handleScan}
          className="bg-brand-primary hover:bg-brand-primary/95 text-white font-medium text-xs h-9 px-4 cursor-pointer inline-flex items-center gap-1.5 shadow-lg shadow-brand-primary/20"
        >
          <Plus className="w-3.5 h-3.5" />
          Scan New Company
        </Button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Type company name, ticker or domain (e.g. Tesla, NVDA)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-white/[0.01] border border-white/[0.08] hover:border-white/20 focus:border-brand-primary rounded-lg outline-none text-slate-200 placeholder-slate-500 transition-colors"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/5 cursor-pointer h-9 px-3 text-xs inline-flex items-center gap-1.5"
          >
            <Filter className="w-3.5 h-3.5" />
            Filters
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/5 cursor-pointer h-9 px-3 text-xs inline-flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5" />
            Browse Sectors
          </Button>
        </div>
      </div>

      {/* Main Panel - Empty State */}
      <div className="border border-white/[0.06] bg-white/[0.01] rounded-xl p-12 min-h-[450px] flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-brand-accent/5 rounded-full blur-3xl" />
        
        <div className="relative z-10 w-full max-w-md">
          <EmptyState
            icon={Building2}
            title="No analyzed companies yet"
            description="Start by scanning a company to trigger public data aggregation, news analysis, financial intelligence, and SWOT builder."
            actionText="Initiate First Scan"
            onActionClick={handleScan}
          />
        </div>
      </div>

      {/* Pro tip card */}
      <div className="p-4 rounded-xl border border-white/[0.06] bg-gradient-to-r from-white/[0.02] to-transparent flex gap-3.5">
        <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.08] flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4 text-brand-accent" />
        </div>
        <div>
          <h4 className="text-xs font-semibold text-slate-200">How to analyze a firm:</h4>
          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
            Enter a domain name or stock symbol. Our system will crawl earnings call transcripts, news feeds, regulatory filings, and social sentiment to deliver a unified intelligence profile in less than 3 minutes.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
