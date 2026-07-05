"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Landmark, Sparkles, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FinancialStatement } from "@/lib/api";

interface FinancialsTabProps {
  companyName: string;
  data?: FinancialStatement;
  isLoading?: boolean;
  error?: string;
  onRunScan?: () => void;
}

export default function FinancialsTab({
  companyName,
  data,
  isLoading,
  error,
  onRunScan,
}: FinancialsTabProps) {
  const [statement, setStatement] = useState<"income" | "balance" | "cash">("income");

  // 1. Error State
  if (error) {
    return (
      <div className="py-12 flex items-center justify-center">
        <div className="w-full max-w-lg rounded-xl border border-red-500/20 bg-red-950/5 p-8 text-center space-y-5">
          <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 mx-auto">
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-bold text-red-200">Financials Processing Error</h3>
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
        <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 w-24 bg-slate-800 rounded" />
          ))}
        </div>
        <div className="border border-white/[0.06] bg-white/[0.01] rounded-xl overflow-hidden animate-pulse">
          <div className="grid grid-cols-4 p-4 border-b border-white/[0.06] bg-white/[0.02]">
            <div className="h-3.5 w-24 bg-slate-800 rounded" />
            <div className="h-3.5 w-16 bg-slate-800 rounded ml-auto" />
            <div className="h-3.5 w-16 bg-slate-800 rounded ml-auto" />
            <div className="h-3.5 w-16 bg-slate-800 rounded ml-auto" />
          </div>
          <div className="divide-y divide-white/[0.04] p-4 space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="grid grid-cols-4 items-center">
                <div className="h-3 w-32 bg-slate-800/80 rounded" />
                <div className="h-3 w-12 bg-slate-800/60 rounded ml-auto" />
                <div className="h-3 w-12 bg-slate-800/60 rounded ml-auto" />
                <div className="h-3 w-12 bg-slate-800/60 rounded ml-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 3. Standby State (Empty)
  if (!data) {
    return (
      <div className="space-y-6 relative min-h-[500px]">
        {/* Blurred background financial table */}
        <div className="space-y-6 pointer-events-none select-none blur-[4px] opacity-20">
          <div className="flex gap-2 border-b border-white/[0.06] pb-3">
            <div className="h-8 w-24 bg-slate-800 rounded" />
            <div className="h-8 w-24 bg-slate-800 rounded" />
          </div>
          <div className="border border-white/[0.06] bg-white/[0.01] rounded-xl overflow-hidden">
            <div className="grid grid-cols-4 p-4 border-b border-white/[0.06]">
              <div className="h-3.5 w-24 bg-slate-800 rounded" />
            </div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="grid grid-cols-4 p-4">
                <div className="h-3 w-32 bg-slate-800 rounded" />
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
            <div className="absolute -top-12 -left-12 w-32 h-32 bg-brand-primary/10 rounded-full blur-2xl -z-10" />

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

  // 4. Data Loaded State
  const activeRows =
    statement === "income"
      ? data.incomeStatement
      : statement === "balance"
      ? data.balanceSheet
      : data.cashFlow;

  const formatValue = (val: number) => {
    const isNegative = val < 0;
    const absVal = Math.abs(val);
    const formatted = `$${absVal.toFixed(1)}B`;
    return isNegative ? `(${formatted})` : formatted;
  };

  return (
    <div className="space-y-6">
      {/* Tab Switcher Controls */}
      <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3">
        <Button
          variant={statement === "income" ? "default" : "ghost"}
          size="sm"
          onClick={() => setStatement("income")}
          className="text-xs cursor-pointer select-none"
        >
          Income Statement
        </Button>
        <Button
          variant={statement === "balance" ? "default" : "ghost"}
          size="sm"
          onClick={() => setStatement("balance")}
          className="text-xs cursor-pointer select-none"
        >
          Balance Sheet
        </Button>
        <Button
          variant={statement === "cash" ? "default" : "ghost"}
          size="sm"
          onClick={() => setStatement("cash")}
          className="text-xs cursor-pointer select-none"
        >
          Cash Flow
        </Button>
      </div>

      {/* Financial Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="border border-white/[0.06] bg-white/[0.01] rounded-xl overflow-hidden"
      >
        <div className="grid grid-cols-4 p-4 border-b border-white/[0.06] bg-white/[0.02] text-slate-400 font-bold text-xs tracking-wider uppercase">
          <div>Financial Metric</div>
          {data.years.map((year) => (
            <div key={year} className="text-right">
              {year}
            </div>
          ))}
        </div>
        
        <div className="divide-y divide-white/[0.04]">
          {activeRows.map((row, idx) => (
            <div
              key={idx}
              className={`grid grid-cols-4 p-4 items-center hover:bg-white/[0.01] transition-colors ${
                row.bold ? "bg-white/[0.01] font-bold text-white" : "text-slate-300"
              }`}
            >
              <span className="text-xs font-semibold">{row.label}</span>
              {row.values.map((val, valIdx) => (
                <div key={valIdx} className="text-right text-xs font-mono font-semibold">
                  {formatValue(val)}
                </div>
              ))}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
