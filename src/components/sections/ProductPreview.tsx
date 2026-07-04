"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  TrendingUp, 
  TrendingDown, 
  Heart, 
  ThumbsUp, 
  AlertTriangle, 
  Sparkles, 
  Layers, 
  DollarSign, 
  Percent, 
  ArrowUpRight 
} from "lucide-react";

// Mock data representing realistic metrics for search
const companyData = {
  acme: {
    name: "Acme Corp",
    ticker: "ACME",
    revenue: "$284.5M",
    revenueGrowth: "+18.2%",
    margin: "24.6%",
    marginChange: "+2.4%",
    sentiment: "92 / 100",
    sentimentStatus: "Very Positive",
    vectors: "1.4M events",
    chartPoints: [45, 62, 58, 74, 95, 110],
    swot: {
      strengths: ["Strong global supply network", "Proprietary ML manufacturing core"],
      weaknesses: ["High dependency on APAC hardware components", "Rising cloud compute overheads"],
      opportunities: ["Expansion into Latin American utility sector", "New B2B API integrations"],
      threats: ["Evolving data governance policies in EU", "Rising competition in low-tier sector"],
    },
    sentimentNews: [
      { text: "Acme announces breakthrough custom enterprise nodes.", score: "96%", type: "positive" },
      { text: "Analyst upgrade: Target raised to $420 following Q2 beats.", score: "88%", type: "positive" },
      { text: "Minor regional labor delay in APAC shipping routes resolved.", score: "65%", type: "neutral" },
    ],
    forecastData: [110, 125, 142, 160],
  },
  vercel: {
    name: "Vercel Inc",
    ticker: "VRCL",
    revenue: "$112.4M",
    revenueGrowth: "+32.8%",
    margin: "18.2%",
    marginChange: "-0.8%",
    sentiment: "96 / 100",
    sentimentStatus: "Exceptionally High",
    vectors: "2.8M events",
    chartPoints: [30, 48, 65, 82, 98, 120],
    swot: {
      strengths: ["Dominant market share in frontend hosting", "Highly developer-loved ecosystem"],
      weaknesses: ["High enterprise churn in self-serve tiers", "Pricing model complexity for bandwidth"],
      opportunities: ["AI SDK growth as standard package", "Next-gen edge computing services"],
      threats: ["Alternative developer tooling frameworks", "Hyperscalers launching clone services"],
    },
    sentimentNews: [
      { text: "Vercel launches Next.js 16 featuring radical build-speed improvements.", score: "98%", type: "positive" },
      { text: "Edge Network volume climbs 140% YoY in serverless transactions.", score: "94%", type: "positive" },
      { text: "Dev community debates new usage-based bandwidth pricing caps.", score: "42%", type: "negative" },
    ],
    forecastData: [120, 145, 178, 210],
  },
  linear: {
    name: "Linear Tech",
    ticker: "LINR",
    revenue: "$64.8M",
    revenueGrowth: "+44.1%",
    margin: "38.5%",
    marginChange: "+4.1%",
    sentiment: "94 / 100",
    sentimentStatus: "Very Positive",
    vectors: "890k events",
    chartPoints: [20, 32, 44, 52, 60, 72],
    swot: {
      strengths: ["Unrivaled product velocity and UI polish", "Organic developer word-of-mouth adoption"],
      weaknesses: ["Slight growth cap in non-tech workspace sectors", "Niche customization APIs"],
      opportunities: ["AI-native project management automation", "Expanding to enterprise HR/product roadmaps"],
      threats: ["Legacy tools copying minimalist interfaces", "Platform consolidation within Jira suite"],
    },
    sentimentNews: [
      { text: "Linear releases new collaborative roadmap cycles.", score: "95%", type: "positive" },
      { text: "Platform uptime reaches 99.999% over the past 365 days.", score: "90%", type: "positive" },
      { text: "User comments express desire for native Gantt-chart style features.", score: "55%", type: "neutral" },
    ],
    forecastData: [72, 88, 112, 138],
  },
};

type ActiveCompany = "acme" | "vercel" | "linear";

export default function ProductPreview() {
  const [activeTab, setActiveTab] = useState<ActiveCompany>("acme");
  const [searchQuery, setSearchQuery] = useState("");
  const current = companyData[activeTab];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.toLowerCase().trim();
    if (query.includes("ver") || query.includes("host")) {
      setActiveTab("vercel");
    } else if (query.includes("lin") || query.includes("issue")) {
      setActiveTab("linear");
    } else {
      setActiveTab("acme");
    }
  };

  return (
    <section id="preview" className="relative py-28 bg-[#050816] overflow-hidden">
      
      {/* Glow effect behind the dashboard */}
      <div className="absolute top-[30%] left-[50%] -translate-x-1/2 w-[80%] h-[35rem] bg-brand-primary/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/[0.08] bg-white/[0.02] mb-5">
            <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">
              Interactive Dashboard Preview
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6">
            The platform that translates data into{" "}
            <span className="text-gradient-rainbow">clear strategy</span>
          </h2>
          <p className="text-slate-400 text-base md:text-lg">
            Interact below to see how ForgeMind maps diverse public records, market news, and financials into an aggregated, structured dashboard.
          </p>
        </div>

        {/* Dashboard Shell Wrapper */}
        <div className="glass-card rounded-2xl border border-white/[0.1] bg-[#050816]/80 shadow-2xl shadow-black overflow-hidden max-w-6xl mx-auto">
          
          {/* Inner Dashboard Header */}
          <div className="border-b border-white/[0.08] bg-white/[0.01] px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Search Bar Mockup */}
            <form onSubmit={handleSearch} className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Search ticker, company (e.g. Vercel, Linear)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-lg bg-white/[0.03] border border-white/[0.08] text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-primary focus:bg-white/[0.05] transition-all"
              />
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <button type="submit" className="hidden" />
            </form>

            {/* Quick Toggle Selectors */}
            <div className="flex items-center gap-2.5 p-1 rounded-lg bg-white/[0.03] border border-white/[0.06]">
              {(Object.keys(companyData) as ActiveCompany[]).map((companyKey) => (
                <button
                  key={companyKey}
                  onClick={() => setActiveTab(companyKey)}
                  className={`px-4 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-all ${
                    activeTab === companyKey
                      ? "bg-brand-primary text-white shadow-md shadow-brand-primary/20"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {companyData[companyKey].name}
                </button>
              ))}
            </div>
          </div>

          {/* Dashboard Main Grid Area */}
          <div className="p-6 md:p-8 space-y-6">
            
            {/* KPI Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Revenue KPI */}
              <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.01] flex flex-col gap-2">
                <div className="flex justify-between items-center text-slate-500">
                  <span className="text-[10px] uppercase font-bold tracking-wider">Annualized Rev</span>
                  <DollarSign className="w-4 h-4 text-brand-primary" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-white">{current.revenue}</span>
                  <span className="text-xs text-emerald-400 font-medium flex items-center gap-0.5">
                    <ArrowUpRight className="w-3 h-3" />
                    {current.revenueGrowth}
                  </span>
                </div>
              </div>

              {/* Net Margin KPI */}
              <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.01] flex flex-col gap-2">
                <div className="flex justify-between items-center text-slate-500">
                  <span className="text-[10px] uppercase font-bold tracking-wider">Net Margin</span>
                  <Percent className="w-4 h-4 text-brand-secondary" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-white">{current.margin}</span>
                  <span className={`text-xs font-medium flex items-center gap-0.5 ${
                    current.marginChange.startsWith("+") ? "text-emerald-400" : "text-rose-400"
                  }`}>
                    {current.marginChange.startsWith("+") ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {current.marginChange}
                  </span>
                </div>
              </div>

              {/* News Sentiment KPI */}
              <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.01] flex flex-col gap-2">
                <div className="flex justify-between items-center text-slate-500">
                  <span className="text-[10px] uppercase font-bold tracking-wider">News Sentiment</span>
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500/10" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-white">{current.sentiment}</span>
                  <span className="text-[10px] text-slate-400 font-medium">{current.sentimentStatus}</span>
                </div>
              </div>

              {/* Vector Size KPI */}
              <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.01] flex flex-col gap-2">
                <div className="flex justify-between items-center text-slate-500">
                  <span className="text-[10px] uppercase font-bold tracking-wider">Indexed Vectors</span>
                  <Layers className="w-4 h-4 text-brand-accent" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-white">{current.vectors}</span>
                  <span className="text-[10px] text-brand-accent font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 animate-pulse" /> Live sync
                  </span>
                </div>
              </div>

            </div>

            {/* Core Panels Grid (Charts, SWOT, Sentiment News) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Chart (High Fidelity SVG Chart) */}
              <div className="lg:col-span-8 p-5 rounded-xl border border-white/[0.06] bg-white/[0.01] flex flex-col justify-between">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h4 className="text-sm font-semibold text-white">Market Value Momentum</h4>
                    <p className="text-xs text-slate-500">6-Month historical scaling (Normalized INDEX)</p>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded bg-brand-primary/10 text-brand-accent border border-brand-primary/20 font-mono font-medium">
                    {current.ticker}_MKT
                  </span>
                </div>

                {/* SVG Chart Canvas */}
                <div className="h-56 w-full relative flex items-end">
                  <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal grid lines */}
                    <line x1="0" y1="50" x2="500" y2="50" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                    <line x1="0" y1="100" x2="500" y2="100" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                    <line x1="0" y1="150" x2="500" y2="150" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />

                    {/* Gradient fill under line */}
                    <AnimatePresence mode="wait">
                      <motion.path
                        key={`fill-${activeTab}`}
                        initial={{ opacity: 0, d: "M 0 200 L 0 200 L 100 200 L 200 200 L 300 200 L 400 200 L 500 200 Z" }}
                        animate={{
                          opacity: 1,
                          d: `M 0 200 
                              L 0 ${200 - current.chartPoints[0]} 
                              L 100 ${200 - current.chartPoints[1]} 
                              L 200 ${200 - current.chartPoints[2]} 
                              L 300 ${200 - current.chartPoints[3]} 
                              L 400 ${200 - current.chartPoints[4]} 
                              L 500 ${200 - current.chartPoints[5]} 
                              L 500 200 Z`,
                        }}
                        transition={{ duration: 0.6 }}
                        fill="url(#chartGlow)"
                      />
                    </AnimatePresence>

                    {/* Smooth line */}
                    <AnimatePresence mode="wait">
                      <motion.path
                        key={`line-${activeTab}`}
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        d={`M 0 ${200 - current.chartPoints[0]} 
                            L 100 ${200 - current.chartPoints[1]} 
                            L 200 ${200 - current.chartPoints[2]} 
                            L 300 ${200 - current.chartPoints[3]} 
                            L 400 ${200 - current.chartPoints[4]} 
                            L 500 ${200 - current.chartPoints[5]}`}
                        fill="none"
                        stroke="#7C3AED"
                        strokeWidth="2.5"
                      />
                    </AnimatePresence>

                    {/* Data Points */}
                    {current.chartPoints.map((pt, idx) => (
                      <circle
                        key={idx}
                        cx={idx * 100}
                        cy={200 - pt}
                        r="4"
                        fill="#06B6D4"
                        stroke="#050816"
                        strokeWidth="2"
                      />
                    ))}
                  </svg>

                  {/* Chart Tooltip Mock */}
                  <div className="absolute top-12 left-[60%] glass-card p-2.5 rounded-lg text-[10px] flex flex-col gap-1 border border-white/10 pointer-events-none shadow-lg">
                    <span className="text-slate-400 font-mono">Q2 Projection</span>
                    <span className="text-white font-bold flex items-center gap-1">
                      Target Met: +{current.revenueGrowth}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono mt-4 border-t border-white/[0.04] pt-3">
                  <span>JAN</span>
                  <span>FEB</span>
                  <span>MAR</span>
                  <span>APR</span>
                  <span>MAY</span>
                  <span>JUN</span>
                </div>
              </div>

              {/* Right Column: Sentiment News Panel */}
              <div className="lg:col-span-4 p-5 rounded-xl border border-white/[0.06] bg-white/[0.01] flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-white mb-1.5 flex items-center gap-1.5">
                    News & Filing Signals
                  </h4>
                  <p className="text-xs text-slate-500 mb-4">Forge NLP sentiment index processing</p>
                </div>

                {/* News Sentiment Feed */}
                <div className="space-y-3.5 my-auto">
                  <AnimatePresence mode="wait">
                    {current.sentimentNews.map((news, idx) => (
                      <motion.div
                        key={`${activeTab}-${idx}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3, delay: idx * 0.1 }}
                        className="p-3 rounded-lg border border-white/[0.04] bg-[#050816]/50 text-xs flex flex-col gap-2"
                      >
                        <p className="text-slate-300 leading-normal">{news.text}</p>
                        <div className="flex justify-between items-center mt-1 border-t border-white/[0.03] pt-1.5">
                          <span className={`text-[10px] font-semibold uppercase ${
                            news.type === "positive" ? "text-emerald-400" : news.type === "neutral" ? "text-slate-400" : "text-rose-400"
                          }`}>
                            {news.type}
                          </span>
                          <span className="font-mono text-[10px] text-slate-500 flex items-center gap-1">
                            <ThumbsUp className="w-2.5 h-2.5" />
                            {news.score} confidence
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

            </div>

            {/* SWOT & Revenue Forecast Bottom Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* SWOT Grid Panel */}
              <div className="lg:col-span-7 p-5 rounded-xl border border-white/[0.06] bg-white/[0.01]">
                <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-1.5">
                  Automated SWOT Matrix
                </h4>
                
                {/* 2x2 SWOT grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Strengths */}
                  <div className="p-3.5 rounded-lg border border-emerald-500/10 bg-emerald-500/[0.01]">
                    <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-emerald-400" />
                      Strengths
                    </div>
                    <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
                      {current.swot.strengths.map((str, idx) => (
                        <li key={idx} className="leading-relaxed">{str}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Weaknesses */}
                  <div className="p-3.5 rounded-lg border border-rose-500/10 bg-rose-500/[0.01]">
                    <div className="text-[10px] font-bold text-rose-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-rose-400" />
                      Weaknesses
                    </div>
                    <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
                      {current.swot.weaknesses.map((str, idx) => (
                        <li key={idx} className="leading-relaxed">{str}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Opportunities */}
                  <div className="p-3.5 rounded-lg border border-brand-secondary/15 bg-brand-secondary/[0.01]">
                    <div className="text-[10px] font-bold text-brand-secondary uppercase tracking-wider mb-2 flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-brand-secondary" />
                      Opportunities
                    </div>
                    <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
                      {current.swot.opportunities.map((str, idx) => (
                        <li key={idx} className="leading-relaxed">{str}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Threats */}
                  <div className="p-3.5 rounded-lg border border-amber-500/15 bg-amber-500/[0.01]">
                    <div className="text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 inline" />
                      Threats
                    </div>
                    <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
                      {current.swot.threats.map((str, idx) => (
                        <li key={idx} className="leading-relaxed">{str}</li>
                      ))}
                    </ul>
                  </div>

                </div>
              </div>

              {/* Revenue Forecast Panel */}
              <div className="lg:col-span-5 p-5 rounded-xl border border-white/[0.06] bg-white/[0.01] flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-white mb-1.5">
                    Forward Revenue Projections
                  </h4>
                  <p className="text-xs text-slate-500 mb-4">AI model simulation of sequential quarterly revenue ($M)</p>
                </div>

                <div className="space-y-3.5 my-auto">
                  {current.forecastData.map((val, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-4">
                      <span className="text-xs text-slate-400 font-mono">Q{idx + 1} 2026 Forecast</span>
                      <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(val / 220) * 100}%` }}
                          transition={{ duration: 0.6, delay: idx * 0.1 }}
                          className="h-full bg-gradient-to-r from-brand-secondary to-brand-accent rounded-full"
                        />
                      </div>
                      <span className="text-xs font-bold text-white font-mono">${val}M</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/[0.04] pt-3 text-[11px] text-slate-500 leading-normal flex items-start gap-1.5 mt-4">
                  <Sparkles className="w-3.5 h-3.5 text-brand-accent flex-shrink-0 mt-0.5" />
                  <span>Forecast calculations take into account competitor SEC filing changes, raw regional logistics delay patterns, and central pricing indices.</span>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
