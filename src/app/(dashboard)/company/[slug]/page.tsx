"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, RefreshCw, Check } from "lucide-react";
import CompanyHeader from "@/components/company/CompanyHeader";
import OverviewTab from "@/components/company/OverviewTab";
import ProductsTab from "@/components/company/ProductsTab";
import FinancialsTab from "@/components/company/FinancialsTab";
import CompetitorsTab from "@/components/company/CompetitorsTab";
import NewsTab from "@/components/company/NewsTab";
import SentimentTab from "@/components/company/SentimentTab";
import ForecastTab from "@/components/company/ForecastTab";
import ExecutiveSummaryTab from "@/components/company/ExecutiveSummaryTab";

const COMPANY_DATA: Record<
  string,
  {
    name: string;
    industry: string;
    headquarters: string;
    ceo: string;
    founded: string | number;
    marketCap: string;
  }
> = {
  nvidia: {
    name: "NVIDIA Corporation",
    industry: "Semiconductors & AI Hardware",
    headquarters: "Santa Clara, California",
    ceo: "Jensen Huang",
    founded: 1993,
    marketCap: "$3.12 Trillion",
  },
  tesla: {
    name: "Tesla, Inc.",
    industry: "Automotive & Clean Energy",
    headquarters: "Austin, Texas",
    ceo: "Elon Musk",
    founded: 2003,
    marketCap: "$820.5 Billion",
  },
  microsoft: {
    name: "Microsoft Corporation",
    industry: "Software & Cloud Computing",
    headquarters: "Redmond, Washington",
    ceo: "Satya Nadella",
    founded: 1975,
    marketCap: "$3.28 Trillion",
  },
  apple: {
    name: "Apple Inc.",
    industry: "Consumer Electronics & Technology",
    headquarters: "Cupertino, California",
    ceo: "Tim Cook",
    founded: 1976,
    marketCap: "$3.43 Trillion",
  },
};

type TabType =
  | "Overview"
  | "Products"
  | "Financials"
  | "Competitors"
  | "News"
  | "Sentiment"
  | "Forecast"
  | "AI Executive Summary";

export default function CompanyWorkspacePage() {
  const params = useParams();
  const rawSlug = typeof params?.slug === "string" ? params.slug : "nvidia";
  const slug = rawSlug.toLowerCase();
  
  const [activeTab, setActiveTab] = useState<TabType>("Overview");
  const [scanState, setScanState] = useState<"idle" | "scanning" | "completed">("idle");

  const company = COMPANY_DATA[slug] || {
    name: rawSlug.toUpperCase() + " Corp.",
    industry: "Technology & Industry Services",
    headquarters: "New York, NY",
    ceo: "Executive Officer",
    founded: 2012,
    marketCap: "$120.0 Billion",
  };

  const tabs: TabType[] = [
    "Overview",
    "Products",
    "Financials",
    "Competitors",
    "News",
    "Sentiment",
    "Forecast",
    "AI Executive Summary",
  ];

  const handleRunScan = () => {
    if (scanState !== "idle") return;
    setScanState("scanning");
    setTimeout(() => {
      setScanState("completed");
      setTimeout(() => {
        setScanState("idle");
      }, 3000);
    }, 4000);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Overview":
        return <OverviewTab companyName={company.name} onRunScan={handleRunScan} />;
      case "Products":
        return <ProductsTab companyName={company.name} onRunScan={handleRunScan} />;
      case "Financials":
        return <FinancialsTab companyName={company.name} onRunScan={handleRunScan} />;
      case "Competitors":
        return <CompetitorsTab companyName={company.name} onRunScan={handleRunScan} />;
      case "News":
        return <NewsTab companyName={company.name} onRunScan={handleRunScan} />;
      case "Sentiment":
        return <SentimentTab companyName={company.name} onRunScan={handleRunScan} />;
      case "Forecast":
        return <ForecastTab companyName={company.name} onRunScan={handleRunScan} />;
      case "AI Executive Summary":
        return <ExecutiveSummaryTab companyName={company.name} onRunScan={handleRunScan} />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 pb-12 text-white"
    >
      {/* Back to Dashboard bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Back to Dashboard
        </Link>

        {scanState === "scanning" && (
          <div className="flex items-center gap-2 text-xs text-brand-accent bg-brand-primary/10 border border-brand-primary/20 px-3 py-1.5 rounded-lg">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            Synthesizing {company.name} data pipeline...
          </div>
        )}
        {scanState === "completed" && (
          <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/20 border border-emerald-500/20 px-3 py-1.5 rounded-lg">
            <Check className="w-3.5 h-3.5" />
            AI synthesis queued successfully
          </div>
        )}
      </div>

      {/* Company Header Block */}
      <CompanyHeader
        name={company.name}
        industry={company.industry}
        headquarters={company.headquarters}
        ceo={company.ceo}
        founded={company.founded}
        marketCap={company.marketCap}
      />

      {/* Tabs Control Row */}
      <div className="border-b border-white/[0.06] overflow-x-auto scrollbar-thin">
        <div className="flex space-x-1 min-w-max pb-px">
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-4 py-3 text-xs font-semibold tracking-wide transition-all cursor-pointer outline-none select-none ${
                  isActive ? "text-brand-accent" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {tab}
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab View Container */}
      <div className="mt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
