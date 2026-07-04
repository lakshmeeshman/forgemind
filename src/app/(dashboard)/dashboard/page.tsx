"use client";

import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import EmptyState from "@/components/dashboard/EmptyState";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const recentSearches = [
    { name: "NVIDIA Corp.", ticker: "NVDA", type: "SWOT Analysis", time: "12 mins ago", status: "Completed" },
    { name: "Tesla Inc.", ticker: "TSLA", type: "Competitor Mapping", time: "2 hours ago", status: "Completed" },
    { name: "Apple Inc.", ticker: "AAPL", type: "Revenue Analysis", time: "1 day ago", status: "Completed" },
  ];

  const quickActions = [
    {
      title: "Scan Company",
      desc: "Initiate AI public data synthesis",
      icon: Search,
      color: "from-brand-primary to-violet-600",
    },
    {
      title: "SWOT Builder",
      desc: "Compile risk/opportunity profiles",
      icon: FileText,
      color: "from-brand-secondary to-blue-600",
    },
    {
      title: "Compare Competitors",
      desc: "Cross-reference multi-firm metrics",
      icon: GitCompare,
      color: "from-brand-accent to-emerald-600",
    },
    {
      title: "Manage Workspace",
      desc: "Configure data pipelines & keys",
      icon: Layers,
      color: "from-amber-500 to-orange-600",
    },
  ];

  const savedReports = [
    {
      title: "NVIDIA Q2 Intelligence Profile",
      meta: "PDF • 2.4MB • Synthesized by Alex Mercer",
      date: "Jul 2, 2026",
    },
    {
      title: "Tesla vs BYD Competitor Analysis",
      meta: "PDF • 1.8MB • Synthesized by Alex Mercer",
      date: "Jun 28, 2026",
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
              <div
                key={action.title}
                className="group relative rounded-xl border border-white/[0.06] bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/[0.1] p-5 transition-all duration-300 cursor-pointer overflow-hidden"
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

            <div className="divide-y divide-white/[0.06]">
              {recentSearches.map((search) => (
                <div
                  key={search.ticker}
                  className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0 hover:bg-white/[0.01] transition-colors rounded-lg px-2 -mx-2 group"
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
                </div>
              ))}
            </div>
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
              <Button variant="ghost" size="sm" className="text-xs text-brand-accent hover:text-brand-accent/80 p-0 hover:bg-transparent font-medium cursor-pointer">
                View All <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>

            <div className="space-y-3">
              {savedReports.map((report) => (
                <div
                  key={report.title}
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
                    >
                      <Download className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
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
