"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, ShieldAlert, TrendingUp, AlertTriangle, Sparkles, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CompanyOverview } from "@/lib/api";

interface OverviewTabProps {
  companyName: string;
  data?: CompanyOverview;
  isLoading?: boolean;
  error?: string;
  onRunScan?: () => void;
}

export default function OverviewTab({
  companyName,
  data,
  isLoading,
  error,
  onRunScan,
}: OverviewTabProps) {
  const swotCategories = [
    {
      title: "Strengths",
      icon: ShieldCheck,
      color: "border-brand-primary/20 hover:border-brand-primary/40",
      iconColor: "text-brand-primary",
      glow: "bg-brand-primary/5",
      items: data?.strengths || [],
    },
    {
      title: "Weaknesses",
      icon: ShieldAlert,
      color: "border-brand-secondary/20 hover:border-brand-secondary/40",
      iconColor: "text-brand-secondary",
      glow: "bg-brand-secondary/5",
      items: data?.weaknesses || [],
    },
    {
      title: "Opportunities",
      icon: TrendingUp,
      color: "border-brand-accent/20 hover:border-brand-accent/40",
      iconColor: "text-brand-accent",
      glow: "bg-brand-accent/5",
      items: data?.opportunities || [],
    },
    {
      title: "Threats",
      icon: AlertTriangle,
      color: "border-amber-500/20 hover:border-amber-500/40",
      iconColor: "text-amber-500",
      glow: "bg-amber-500/5",
      items: data?.threats || [],
    },
  ];

  // 1. Error State
  if (error) {
    return (
      <div className="py-12 flex items-center justify-center">
        <div className="w-full max-w-lg rounded-xl border border-red-500/20 bg-red-950/5 p-8 text-center space-y-5 relative overflow-hidden">
          <div className="absolute -top-12 -left-12 w-24 h-24 bg-red-500/5 rounded-full blur-2xl" />
          <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 mx-auto">
            <ShieldAlert className="w-6 h-6 text-red-400" />
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-bold text-red-200">SWOT Pipeline Error</h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
              {error}
            </p>
          </div>
          {onRunScan && (
            <Button
              onClick={onRunScan}
              className="bg-red-950/30 hover:bg-red-900/40 border border-red-500/30 text-red-300 text-xs font-semibold px-4 h-9 cursor-pointer"
            >
              Retry Synthesis Scan
            </Button>
          )}
        </div>
      </div>
    );
  }

  // 2. Loading State (Skeletons)
  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Skeleton Summary Card */}
        <div className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.01] space-y-3">
          <div className="h-4 w-48 bg-slate-800 rounded animate-pulse" />
          <div className="space-y-2">
            <div className="h-3 w-full bg-slate-800/80 rounded animate-pulse" />
            <div className="h-3 w-5/6 bg-slate-800/80 rounded animate-pulse" />
            <div className="h-3 w-4/5 bg-slate-800/80 rounded animate-pulse" />
          </div>
        </div>

        {/* Skeleton SWOT Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {swotCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.title}
                className={`p-5 rounded-xl border ${cat.color} bg-white/[0.01] space-y-4`}
              >
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${cat.glow}`}>
                    <Icon className={`w-4 h-4 ${cat.iconColor}`} />
                  </div>
                  <span className="text-sm font-semibold text-slate-200">{cat.title}</span>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-700 shrink-0" />
                    <div className="h-3 w-11/12 bg-slate-800/70 rounded animate-pulse" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-700 shrink-0" />
                    <div className="h-3 w-10/12 bg-slate-800/70 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // 3. Standby State (Empty)
  if (!data) {
    return (
      <div className="space-y-6 relative min-h-[500px]">
        {/* Blurred background content */}
        <div className="space-y-6 pointer-events-none select-none blur-[4px] opacity-25 transition-all">
          <div className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.01] space-y-3">
            <div className="h-4 w-48 bg-slate-800 rounded" />
            <div className="space-y-2">
              <div className="h-3 w-full bg-slate-800/85 rounded" />
              <div className="h-3 w-5/6 bg-slate-800/85 rounded" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {swotCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div key={cat.title} className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.01] space-y-4">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-slate-500" />
                    <span className="text-sm font-semibold text-slate-400">{cat.title}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Standby Glass empty state */}
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full max-w-lg rounded-xl border border-white/[0.08] bg-[#090d22]/80 backdrop-blur-md p-8 text-center space-y-6 shadow-2xl relative"
          >
            <div className="absolute -top-12 -left-12 w-32 h-32 bg-brand-primary/10 rounded-full blur-2xl -z-10" />
            <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-brand-accent/10 rounded-full blur-2xl -z-10" />

            <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-white/[0.02] border border-white/[0.08] mx-auto group">
              <Database className="w-6 h-6 text-brand-accent group-hover:scale-105 transition-transform" />
              <div className="absolute inset-0 -z-10 rounded-2xl bg-brand-accent/5 blur-sm" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white tracking-tight">SWOT Matrix Standby</h3>
              <p className="text-sm text-slate-400 leading-relaxed max-w-sm mx-auto">
                Awaiting data ingestion. Once you trigger a pipeline scan, our AI engines will parse SEC Edgar files, earnings call transcripts, and press releases to synthesize the SWOT matrix.
              </p>
            </div>

            {onRunScan && (
              <Button
                onClick={onRunScan}
                className="bg-brand-primary hover:bg-brand-primary/90 text-white text-xs font-semibold px-4 h-9 cursor-pointer inline-flex items-center gap-1.5 shadow-lg shadow-brand-primary/10"
              >
                <Sparkles className="w-3.5 h-3.5 text-brand-accent" />
                Scan {companyName}
              </Button>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  // 4. Data Loaded State
  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-xl border border-white/[0.06] bg-white/[0.01] space-y-3 relative overflow-hidden"
      >
        <div className="absolute -top-12 -right-12 w-24 h-24 bg-brand-primary/5 rounded-full blur-xl" />
        <h3 className="text-sm font-bold text-brand-accent uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-4 h-4" />
          Executive Brief Summary
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed font-medium">
          {data.summary}
        </p>
      </motion.div>

      {/* SWOT Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {swotCategories.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={cat.title}
              className={`p-5 rounded-xl border ${cat.color} bg-white/[0.01] hover:bg-white/[0.02] transition-colors space-y-4`}
            >
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${cat.glow}`}>
                  <Icon className={`w-4 h-4 ${cat.iconColor}`} />
                </div>
                <span className="text-sm font-bold text-slate-200">{cat.title}</span>
              </div>

              <ul className="space-y-2.5">
                {cat.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="flex items-start gap-2 text-xs text-slate-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-700 shrink-0 mt-1.5" />
                    <span className="leading-relaxed font-medium text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
