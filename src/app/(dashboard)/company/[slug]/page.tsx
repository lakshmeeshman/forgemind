"use client";

import React, { useState, useEffect, useCallback } from "react";
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
import {
  companyApi,
  reportApi,
  Company,
  CompanyOverview,
  Product,
  FinancialStatement,
  Competitor,
  NewsArticle,
  SentimentData,
  Forecast,
  ExecutiveSummary
} from "@/lib/api";

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

  const [company, setCompany] = useState<Company | null>(null);
  const [overview, setOverview] = useState<CompanyOverview | null>(null);
  const [products, setProducts] = useState<Product[] | null>(null);
  const [financials, setFinancials] = useState<FinancialStatement | null>(null);
  const [competitors, setCompetitors] = useState<Competitor[] | null>(null);
  const [news, setNews] = useState<NewsArticle[] | null>(null);
  const [sentiment, setSentiment] = useState<SentimentData | null>(null);
  const [forecast, setForecast] = useState<Forecast[] | null>(null);
  const [execSummary, setExecSummary] = useState<ExecutiveSummary | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      // 1. Load basic company metadata
      const profile = await companyApi.getCompanyBySlug(slug);
      setCompany(profile);

      // 2. If ingested, fetch the detailed tabs datasets
      if (profile.status === "Ingested") {
        const [
          dataOverview,
          dataProducts,
          dataFinancials,
          dataCompetitors,
          dataNews,
          dataSentiment,
          dataForecast,
          dataSummary
        ] = await Promise.all([
          companyApi.getCompanyOverview(slug).catch(() => null),
          companyApi.getCompanyProducts(slug).catch(() => null),
          companyApi.getCompanyFinancials(slug).catch(() => null),
          companyApi.getCompanyCompetitors(slug).catch(() => null),
          companyApi.getCompanyNews(slug).catch(() => null),
          companyApi.getCompanySentiment(slug).catch(() => null),
          companyApi.getCompanyForecast(slug).catch(() => null),
          reportApi.getExecutiveSummary(slug).catch(() => null)
        ]);

        setOverview(dataOverview);
        setProducts(dataProducts);
        setFinancials(dataFinancials);
        setCompetitors(dataCompetitors);
        setNews(dataNews);
        setSentiment(dataSentiment);
        setForecast(dataForecast);
        setExecSummary(dataSummary);
      } else {
        // Reset states if company is in Standby mode
        setOverview(null);
        setProducts(null);
        setFinancials(null);
        setCompetitors(null);
        setNews(null);
        setSentiment(null);
        setForecast(null);
        setExecSummary(null);
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Failed to load company workspace. Verify network connections.";
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRunScan = async () => {
    if (scanState !== "idle") return;
    setScanState("scanning");
    setError("");
    try {
      await companyApi.scanCompany(slug);
      setScanState("completed");
      await loadData();
      setTimeout(() => {
        setScanState("idle");
      }, 3000);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Pipeline scan failed to compile company parameters.";
      setError(errMsg);
      setScanState("idle");
    }
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

  const renderTabContent = () => {
    const defaultCompanyName = company?.name || rawSlug.toUpperCase() + " Corp.";
    
    switch (activeTab) {
      case "Overview":
        return (
          <OverviewTab
            companyName={defaultCompanyName}
            data={overview || undefined}
            isLoading={isLoading}
            error={error}
            onRunScan={handleRunScan}
          />
        );
      case "Products":
        return (
          <ProductsTab
            companyName={defaultCompanyName}
            data={products || undefined}
            isLoading={isLoading}
            error={error}
            onRunScan={handleRunScan}
          />
        );
      case "Financials":
        return (
          <FinancialsTab
            companyName={defaultCompanyName}
            data={financials || undefined}
            isLoading={isLoading}
            error={error}
            onRunScan={handleRunScan}
          />
        );
      case "Competitors":
        return (
          <CompetitorsTab
            companyName={defaultCompanyName}
            data={competitors || undefined}
            isLoading={isLoading}
            error={error}
            onRunScan={handleRunScan}
          />
        );
      case "News":
        return (
          <NewsTab
            companyName={defaultCompanyName}
            data={news || undefined}
            isLoading={isLoading}
            error={error}
            onRunScan={handleRunScan}
          />
        );
      case "Sentiment":
        return (
          <SentimentTab
            companyName={defaultCompanyName}
            data={sentiment || undefined}
            isLoading={isLoading}
            error={error}
            onRunScan={handleRunScan}
          />
        );
      case "Forecast":
        return (
          <ForecastTab
            companyName={defaultCompanyName}
            data={forecast || undefined}
            isLoading={isLoading}
            error={error}
            onRunScan={handleRunScan}
          />
        );
      case "AI Executive Summary":
        return (
          <ExecutiveSummaryTab
            companyName={defaultCompanyName}
            data={execSummary || undefined}
            isLoading={isLoading}
            error={error}
            onRunScan={handleRunScan}
          />
        );
      default:
        return null;
    }
  };

  const defaultCompany = {
    name: rawSlug.toUpperCase() + " Corp.",
    industry: "Technology & Industry Services",
    headquarters: "New York, NY",
    ceo: "Executive Officer",
    founded: 2012,
    marketCap: "$120.0 Billion",
  };

  const displayedCompany = company || defaultCompany;

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
            Synthesizing {displayedCompany.name} data pipeline...
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
        name={displayedCompany.name}
        industry={displayedCompany.industry}
        headquarters={displayedCompany.headquarters}
        ceo={displayedCompany.ceo}
        founded={displayedCompany.founded}
        marketCap={displayedCompany.marketCap}
        scanState={scanState}
        onScan={handleRunScan}
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
