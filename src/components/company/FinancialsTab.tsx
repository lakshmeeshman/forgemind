"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Landmark, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FinancialsTabProps {
  companyName: string;
  onRunScan?: () => void;
}

export default function FinancialsTab({ companyName, onRunScan }: FinancialsTabProps) {
  const [statement, setStatement] = useState<"income" | "balance" | "cash">("income");

  return (
    <div className="space-y-6 relative min-h-[500px]">
      {/* Tab Switcher Controls (Blurred along with background) */}
      <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3 pointer-events-none select-none blur-[2px] opacity-35">
        <Button
          variant={statement === "income" ? "default" : "ghost"}
          size="sm"
          onClick={() => setStatement("income")}
          className="text-xs"
        >
          Income Statement
        </Button>
        <Button
          variant={statement === "balance" ? "default" : "ghost"}
          size="sm"
          onClick={() => setStatement("balance")}
          className="text-xs"
        >
          Balance Sheet
        </Button>
        <Button
          variant={statement === "cash" ? "default" : "ghost"}
          size="sm"
          onClick={() => setStatement("cash")}
          className="text-xs"
        >
          Cash Flow
        </Button>
      </div>

      {/* Blurred background financial table */}
      <div className="border border-white/[0.06] bg-white/[0.01] rounded-xl overflow-hidden pointer-events-none select-none blur-[4px] opacity-20">
        <div className="grid grid-cols-4 p-4 border-b border-white/[0.06] bg-white/[0.02]">
          <div className="h-3 w-24 bg-slate-800 rounded animate-pulse" />
          <div className="h-3 w-16 bg-slate-800 rounded animate-pulse ml-auto" />
          <div className="h-3 w-16 bg-slate-800 rounded animate-pulse ml-auto" />
          <div className="h-3 w-16 bg-slate-800 rounded animate-pulse ml-auto" />
        </div>
        
        <div className="divide-y divide-white/[0.04]">
          {[
            { label: "Total Revenue", bold: true },
            { label: "Cost of Revenue", bold: false },
            { label: "Gross Profit", bold: true },
            { label: "Research & Development", bold: false },
            { label: "Selling, General & Admin", bold: false },
            { label: "Operating Income", bold: true },
            { label: "Net Income", bold: true },
          ].map((row, i) => (
            <div key={i} className="grid grid-cols-4 p-4 items-center">
              <span className={`text-xs ${row.bold ? "font-bold bg-slate-800/80" : "bg-slate-800/60"} h-3.5 w-32 rounded animate-pulse block`} />
              <div className="h-3 w-12 bg-slate-800/60 rounded animate-pulse ml-auto" />
              <div className="h-3 w-12 bg-slate-800/60 rounded animate-pulse ml-auto" />
              <div className="h-3 w-12 bg-slate-800/60 rounded animate-pulse ml-auto" />
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
          <div className="absolute -top-12 -left-12 w-32 h-32 bg-brand-primary/10 rounded-full blur-2xl -z-10" />

          {/* Icon */}
          <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-white/[0.02] border border-white/[0.08] mx-auto group">
            <Landmark className="w-6 h-6 text-brand-accent group-hover:scale-105 transition-transform" />
            <div className="absolute inset-0 -z-10 rounded-2xl bg-brand-accent/5 blur-sm" />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white tracking-tight">SEC Financials Engine Standby</h3>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm mx-auto">
              SEC Edgar crawlers are offline. Running the intelligence pipeline scan will parse historical XBRL filings to construct full Income, Balance, and Cash Flow statements.
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
