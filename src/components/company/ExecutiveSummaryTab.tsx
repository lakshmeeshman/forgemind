"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExecutiveSummaryTabProps {
  companyName: string;
  onRunScan?: () => void;
}

export default function ExecutiveSummaryTab({ companyName, onRunScan }: ExecutiveSummaryTabProps) {
  return (
    <div className="space-y-6 relative min-h-[500px]">
      {/* Blurred background document briefing */}
      <div className="p-8 border border-white/[0.06] bg-white/[0.01] rounded-xl space-y-6 pointer-events-none select-none blur-[4.5px] opacity-20">
        {/* Document Header */}
        <div className="flex justify-between items-start border-b border-white/[0.08] pb-4">
          <div className="space-y-2">
            <div className="h-4 w-56 bg-slate-800 rounded animate-pulse" />
            <div className="h-3 w-32 bg-slate-800/80 rounded animate-pulse" />
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-dashed border-slate-700" />
        </div>

        {/* Section 1 */}
        <div className="space-y-3">
          <div className="h-3.5 w-32 bg-slate-800 rounded animate-pulse" />
          <div className="space-y-2">
            <div className="h-2.5 w-full bg-slate-800/60 rounded animate-pulse" />
            <div className="h-2.5 w-full bg-slate-800/60 rounded animate-pulse" />
            <div className="h-2.5 w-11/12 bg-slate-800/60 rounded animate-pulse" />
          </div>
        </div>

        {/* Section 2 */}
        <div className="space-y-3">
          <div className="h-3.5 w-36 bg-slate-800 rounded animate-pulse" />
          <div className="space-y-2">
            <div className="h-2.5 w-full bg-slate-800/60 rounded animate-pulse" />
            <div className="h-2.5 w-4/5 bg-slate-800/60 rounded animate-pulse" />
          </div>
        </div>

        {/* Mock Signatures */}
        <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/[0.06]">
          <div className="space-y-2">
            <div className="h-10 w-24 bg-slate-800/30 rounded animate-pulse border-b border-dashed border-slate-700" />
            <div className="h-2 w-16 bg-slate-800 rounded" />
          </div>
          <div className="space-y-2">
            <div className="h-10 w-24 bg-slate-800/30 rounded animate-pulse border-b border-dashed border-slate-700" />
            <div className="h-2 w-20 bg-slate-800 rounded" />
          </div>
        </div>
      </div>

      {/* Foreground Beautiful Empty State */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-lg rounded-xl border border-white/[0.08] bg-[#090d22]/80 backdrop-blur-md p-8 text-center space-y-6 shadow-2xl relative"
        >
          {/* Decorative Glow */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-brand-primary/10 rounded-full blur-2xl -z-10" />

          {/* Icon */}
          <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-white/[0.02] border border-white/[0.08] mx-auto group">
            <FileSpreadsheet className="w-6 h-6 text-brand-accent group-hover:scale-105 transition-transform" />
            <div className="absolute inset-0 -z-10 rounded-2xl bg-brand-accent/5 blur-sm" />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white tracking-tight">AI Report Compiler Standby</h3>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm mx-auto">
              LangGraph agent synthesis is currently offline. Dispatches of the crawler pipeline will trigger the agent to compile a comprehensive executive briefing, detailing risk scores and SWOT factors.
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
