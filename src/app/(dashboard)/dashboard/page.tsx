"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  FileText,
  GitCompare,
  Layers,
  ArrowRight,
  History,
  Building2,
  Calendar,
  Download,
  AlertCircle,
  TrendingUp,
  RefreshCw
} from "lucide-react";
import EmptyState from "@/components/dashboard/EmptyState";
import { Button } from "@/components/ui/button";
import { companyApi, reportApi, Company, SavedReport } from "@/lib/api";

const ListSkeleton = () => (
  <div className="space-y-4 py-2">
    {[1, 2, 3].map((i) => (
      <div key={i} className="flex items-center justify-between py-2 border-b border-white/[0.02] last:border-0 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-800" />
          <div className="space-y-2">
            <div className="h-3.5 w-32 bg-slate-800 rounded" />
            <div className="h-2.5 w-24 bg-slate-800/60 rounded" />
          </div>
        </div>
        <div className="h-3 w-14 bg-slate-800 rounded" />
      </div>
    ))}
  </div>
);

const SectionError = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <div className="p-4 rounded-xl border border-red-500/10 bg-red-950/5 text-center space-y-3">
    <div className="flex items-center gap-2 text-xs font-semibold text-red-400 justify-center">
      <AlertCircle className="w-4 h-4 shrink-0" />
      <span>Data ingestion pipeline unavailable</span>
    </div>
    <p className="text-[10px] text-slate-400 leading-relaxed max-w-xs mx-auto">{message}</p>
    <Button
      onClick={onRetry}
      size="sm"
      className="h-7 text-[10px] bg-red-950/20 hover:bg-red-900/30 border border-red-500/30 text-red-300 cursor-pointer"
    >
      <RefreshCw className="w-3 h-3 mr-1" />
      Retry
    </Button>
  </div>
);

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [reports, setReports] = useState<SavedReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const [allCompanies, allReports] = await Promise.all([
        companyApi.getCompanies(),
        reportApi.getReports()
      ]);
      setCompanies(allCompanies);
      setReports(allReports);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Failed to load dashboard parameters.";
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    loadData();
  }, [loadData]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } },
  };

  if (!mounted) return null;

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Extract up to 3 ingested companies to represent recent runs
  const ingestedCompanies = companies.filter((c) => c.status === "Ingested");
  const recentRuns = ingestedCompanies.slice(0, 3).map((c) => ({
    name: c.name,
    ticker: c.ticker,
    slug: c.slug,
    type: "SWOT & Financials Synthesis",
    time: c.founded ? `Founded ${c.founded}` : "Ingested recently",
    status: "Completed"
  }));

  const quickActions = [
    {
      title: "Scan Company",
      desc: "Initiate AI public data synthesis",
      icon: Search,
      color: "from-brand-primary to-violet-600",
      href: "/companies"
    },
    {
      title: "SWOT Builder",
      desc: "Compile risk/opportunity profiles",
      icon: FileText,
      color: "from-brand-secondary to-blue-600",
      href: "/companies"
    },
    {
      title: "Compare Competitors",
      desc: "Cross-reference multi-firm metrics",
      icon: GitCompare,
      color: "from-brand-accent to-emerald-600",
      href: "/companies"
    },
    {
      title: "Manage Workspace",
      desc: "Configure data pipelines & keys",
      icon: Layers,
      color: "from-amber-500 to-orange-600",
      href: "/settings?tab=workspace"
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8 pb-12"
    >
      {/* Welcome Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Welcome back, <span className="bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent bg-clip-text text-transparent">Alex</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Enterprise Intelligence overview. Analyze and synthesize corporate profiles.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/[0.06] bg-white/[0.01] backdrop-blur-md w-fit">
          <Calendar className="w-4 h-4 text-brand-accent" />
          <span className="text-xs font-semibold text-slate-300">{currentDate}</span>
        </div>
      </motion.div>

      {/* Quick Actions Grid */}
      <motion.div variants={itemVariants} className="space-y-3">
        <h2 className="text-xs font-bold tracking-wider text-slate-500 uppercase">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.title} href={action.href}>
                <div
                  className="group relative rounded-xl border border-white/[0.06] bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/[0.1] p-5 transition-all duration-300 cursor-pointer overflow-hidden h-full"
                >
                  <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-5 rounded-full blur-xl transition-opacity duration-300`} />
                  <div className="w-10 h-10 rounded-lg bg-white/[0.03] border border-white/[0.08] flex items-center justify-center mb-4 group-hover:border-white/20 transition-colors">
                    <Icon className="w-5 h-5 text-brand-accent group-hover:scale-105 transition-transform" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {action.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </motion.div>

      {/* Main Content Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Recent Searches & Saved Reports */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Recent Searches Card */}
          <motion.div
            variants={itemVariants}
            className="rounded-xl border border-white/[0.06] bg-white/[0.01] backdrop-blur-md p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-brand-accent" />
                <h3 className="text-sm font-semibold text-slate-200">Recent Intelligence Runs</h3>
              </div>
              <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase bg-white/5 border border-white/10 px-2 py-0.5 rounded">
                Live Status
              </span>
            </div>

            {isLoading ? (
              <ListSkeleton />
            ) : error ? (
              <SectionError message={error} onRetry={loadData} />
            ) : recentRuns.length > 0 ? (
              <div className="divide-y divide-white/[0.06]">
                {recentRuns.map((search) => (
                  <Link
                    key={search.slug}
                    href={`/company/${search.slug}`}
                    className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0 hover:bg-white/[0.01] transition-colors rounded-lg px-2 -mx-2 group block"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/[0.02] border border-white/[0.08] flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-slate-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors">
                            {search.name}
                          </span>
                          <span className="text-[9px] font-bold text-slate-400 bg-white/5 border border-white/10 px-1 rounded">
                            {search.ticker}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 mt-0.5 block">{search.type}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] text-slate-500 font-medium hidden sm:inline">
                        {search.time}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[10px] font-semibold text-emerald-400">{search.status}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-slate-400">
                No active company profiles scanned yet.
              </div>
            )}
          </motion.div>

          {/* Saved Reports Card */}
          <motion.div
            variants={itemVariants}
            className="rounded-xl border border-white/[0.06] bg-white/[0.01] backdrop-blur-md p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-accent" />
                <h3 className="text-sm font-semibold text-slate-200">Generated Executive Summaries</h3>
              </div>
              <Link href="/reports">
                <Button variant="ghost" size="sm" className="text-xs text-brand-accent hover:text-brand-accent/80 p-0 hover:bg-transparent font-medium cursor-pointer">
                  View All <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>

            {isLoading ? (
              <ListSkeleton />
            ) : error ? (
              <SectionError message={error} onRetry={loadData} />
            ) : reports.length > 0 ? (
              <div className="space-y-3">
                {reports.slice(0, 3).map((report) => (
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
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-slate-400">
                No reports compiled yet.
              </div>
            )}
          </motion.div>

        </div>

        {/* Right Side: Empty State Placeholders (Custom Feeds & Alerts) */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Active Alerts Panel */}
          <motion.div
            variants={itemVariants}
            className="rounded-xl border border-white/[0.06] bg-white/[0.01] backdrop-blur-md p-6 space-y-6"
          >
            <div className="flex items-center gap-2 pb-3 border-b border-white/[0.06]">
              <AlertCircle className="w-4 h-4 text-brand-accent" />
              <h3 className="text-sm font-semibold text-slate-200">Intelligence Feeds</h3>
            </div>

            <EmptyState
              icon={TrendingUp}
              title="No active alert feeds"
              description="Monitored channels for real-time news alerts are empty. Create custom search criteria to track corporate changes."
              actionText="Set Alert Feed"
              onActionClick={() => {
                alert("This action will open custom feed configuration in Sprint 3.");
              }}
            />
          </motion.div>

        </div>

      </div>
    </motion.div>
  );
}
