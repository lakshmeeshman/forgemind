"use client";

import React from "react";
import { motion } from "framer-motion";
import { GitCompare, Sparkles, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Competitor } from "@/lib/api";

interface CompetitorsTabProps {
  companyName: string;
  data?: Competitor[];
  isLoading?: boolean;
  error?: string;
  onRunScan?: () => void;
}

export default function CompetitorsTab({
  companyName,
  data,
  isLoading,
  error,
  onRunScan,
}: CompetitorsTabProps) {
  // 1. Error State
  if (error) {
    return (
      <div className="py-12 flex items-center justify-center">
        <div className="w-full max-w-lg rounded-xl border border-red-500/20 bg-red-950/5 p-8 text-center space-y-5">
          <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 mx-auto">
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-bold text-red-200">Competitors Benchmark Error</h3>
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
      <div className="border border-white/[0.06] bg-white/[0.01] rounded-xl overflow-hidden animate-pulse">
        <div className="grid grid-cols-7 p-4 border-b border-white/[0.06] bg-white/[0.02]">
          <div className="h-3 w-16 bg-slate-800 rounded" />
          <div className="h-3 w-12 bg-slate-800 rounded ml-auto" />
          <div className="h-3 w-12 bg-slate-800 rounded ml-auto" />
          <div className="h-3 w-12 bg-slate-800 rounded ml-auto" />
          <div className="h-3 w-12 bg-slate-800 rounded ml-auto" />
          <div className="h-3 w-12 bg-slate-800 rounded ml-auto" />
          <div className="h-3 w-12 bg-slate-800 rounded ml-auto" />
        </div>

        <div className="divide-y divide-white/[0.04] p-4 space-y-4">
          {[1, 2, 3].map((idx) => (
            <div key={idx} className="grid grid-cols-7 items-center">
              <div className="h-3 w-20 bg-slate-800/80 rounded" />
              <div className="h-3 w-10 bg-slate-800/60 rounded ml-auto" />
              <div className="h-3 w-10 bg-slate-800/60 rounded ml-auto" />
              <div className="h-3 w-10 bg-slate-800/60 rounded ml-auto" />
              <div className="h-3 w-10 bg-slate-800/60 rounded ml-auto" />
              <div className="h-3 w-10 bg-slate-800/60 rounded ml-auto" />
              <div className="h-3 w-10 bg-slate-800/60 rounded ml-auto" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 3. Standby State (Empty)
  if (!data) {
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
            {[1, 2, 3].map((i) => (
              <div key={i} className="grid grid-cols-4 p-4 items-center">
                <span className="text-xs text-slate-300 font-medium">Metric Row</span>
                <div className="h-3 w-12 bg-slate-800 rounded" />
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
            <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-brand-accent/10 rounded-full blur-2xl -z-10" />

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

  // 4. Data Loaded State
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-white/[0.06] bg-white/[0.01] rounded-xl overflow-hidden overflow-x-auto scrollbar-thin"
    >
      <table className="w-full min-w-[700px] border-collapse text-left text-xs text-white">
        <thead>
          <tr className="border-b border-white/[0.06] bg-white/[0.02] text-slate-400 font-bold uppercase tracking-wider">
            <th className="p-4">Corporate Entity</th>
            <th className="p-4 text-right">Market Cap</th>
            <th className="p-4 text-right">P/E Ratio</th>
            <th className="p-4 text-right">Rev. Growth</th>
            <th className="p-4 text-right">Op. Margin</th>
            <th className="p-4 text-right">R&D Intensity</th>
            <th className="p-4 text-right">Debt/Equity</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.04] font-mono">
          {data.map((peer, idx) => {
            const isTarget = peer.isTargetCompany;
            return (
              <tr
                key={idx}
                className={`hover:bg-white/[0.02] transition-colors ${
                  isTarget ? "bg-brand-primary/5 font-bold border-l-2 border-l-brand-accent text-white" : "text-slate-300"
                }`}
              >
                <td className="p-4 font-sans font-semibold">
                  {peer.name}
                  {isTarget && (
                    <span className="ml-2 text-[9px] font-bold text-brand-accent bg-brand-primary/10 border border-brand-primary/20 px-1 rounded uppercase">
                      Target
                    </span>
                  )}
                </td>
                <td className="p-4 text-right font-semibold">{peer.marketCap}</td>
                <td className="p-4 text-right font-semibold">{peer.peRatio}</td>
                <td className="p-4 text-right font-semibold text-emerald-400">{peer.revenueGrowth}</td>
                <td className="p-4 text-right font-semibold">{peer.operatingMargin}</td>
                <td className="p-4 text-right font-semibold">{peer.rdIntensity}</td>
                <td className="p-4 text-right font-semibold">{peer.debtToEquity}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </motion.div>
  );
}
