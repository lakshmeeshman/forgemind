"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, ShieldAlert, TrendingUp, AlertTriangle, Sparkles, Database } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OverviewTabProps {
  companyName: string;
  onRunScan?: () => void;
}

export default function OverviewTab({ companyName, onRunScan }: OverviewTabProps) {
  const swotCategories = [
    {
      title: "Strengths",
      icon: ShieldCheck,
      color: "border-brand-primary/20 hover:border-brand-primary/40",
      iconColor: "text-brand-primary",
      glow: "bg-brand-primary/5",
    },
    {
      title: "Weaknesses",
      icon: ShieldAlert,
      color: "border-brand-secondary/20 hover:border-brand-secondary/40",
      iconColor: "text-brand-secondary",
      glow: "bg-brand-secondary/5",
    },
    {
      title: "Opportunities",
      icon: TrendingUp,
      color: "border-brand-accent/20 hover:border-brand-accent/40",
      iconColor: "text-brand-accent",
      glow: "bg-brand-accent/5",
    },
    {
      title: "Threats",
      icon: AlertTriangle,
      color: "border-amber-500/20 hover:border-amber-500/40",
      iconColor: "text-amber-500",
      glow: "bg-amber-500/5",
    },
  ];

  return (
    <div className="space-y-6 relative min-h-[500px]">
      {/* Blurred background content */}
      <div className="space-y-6 pointer-events-none select-none blur-[4px] opacity-25 transition-all">
        {/* Mock Summary Card */}
        <div className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.01] space-y-3">
          <div className="h-4 w-48 bg-slate-800 rounded animate-pulse" />
          <div className="space-y-2">
            <div className="h-3 w-full bg-slate-800/80 rounded animate-pulse" />
            <div className="h-3 w-5/6 bg-slate-800/80 rounded animate-pulse" />
            <div className="h-3 w-4/5 bg-slate-800/80 rounded animate-pulse" />
          </div>
        </div>

        {/* SWOT Grid */}
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
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-700 shrink-0" />
                    <div className="h-3 w-4/5 bg-slate-800/70 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Foreground Beautiful Glass Empty State */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-lg rounded-xl border border-white/[0.08] bg-[#090d22]/80 backdrop-blur-md p-8 text-center space-y-6 shadow-2xl relative"
        >
          {/* Decorative Gradient Background */}
          <div className="absolute -top-12 -left-12 w-32 h-32 bg-brand-primary/10 rounded-full blur-2xl -z-10" />
          <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-brand-accent/10 rounded-full blur-2xl -z-10" />

          {/* Icon frame */}
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
