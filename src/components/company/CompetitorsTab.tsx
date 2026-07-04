"use client";

import React from "react";
import { motion } from "framer-motion";
import { GitCompare, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CompetitorsTabProps {
  companyName: string;
  onRunScan?: () => void;
}

export default function CompetitorsTab({ companyName, onRunScan }: CompetitorsTabProps) {
  return (
    <div className="space-y-6 relative min-h-[500px]">
      {/* Blurred background comparison table */}
      <div className="border border-white/[0.06] bg-white/[0.01] rounded-xl overflow-hidden pointer-events-none select-none blur-[4px] opacity-25">
        <div className="grid grid-cols-4 p-4 border-b border-white/[0.06] bg-white/[0.02] text-slate-400 font-semibold text-xs">
          <div>Metric</div>
          <div className="text-brand-accent font-bold">{companyName}</div>
          <div>Peer A</div>
          <div>Peer B</div>
        </div>

        <div className="divide-y divide-white/[0.04]">
          {[
            "Market Cap",
            "P/E Ratio",
            "Revenue Growth (YoY)",
            "Operating Margin",
            "R&D Intensity",
            "Debt-to-Equity Ratio",
          ].map((metric) => (
            <div key={metric} className="grid grid-cols-4 p-4 items-center">
              <span className="text-xs text-slate-300 font-medium">{metric}</span>
              <div className="h-3 w-12 bg-slate-800 rounded animate-pulse" />
              <div className="h-3 w-10 bg-slate-800/80 rounded animate-pulse" />
              <div className="h-3 w-10 bg-slate-800/80 rounded animate-pulse" />
            </div>
          ))}
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
          <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-brand-accent/10 rounded-full blur-2xl -z-10" />

          {/* Icon */}
          <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-white/[0.02] border border-white/[0.08] mx-auto group">
            <GitCompare className="w-6 h-6 text-brand-accent group-hover:scale-105 transition-transform" />
            <div className="absolute inset-0 -z-10 rounded-2xl bg-brand-accent/5 blur-sm" />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white tracking-tight">Peer Comparison Pending</h3>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm mx-auto">
              Competitor universe mapping is currently offline. Triggering the intelligence scan runs dynamic clustering models to map peers and benchmark financial ratios.
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
