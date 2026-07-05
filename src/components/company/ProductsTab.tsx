"use client";

import React from "react";
import { motion } from "framer-motion";
import { Layers, Sparkles, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/api";

interface ProductsTabProps {
  companyName: string;
  data?: Product[];
  isLoading?: boolean;
  error?: string;
  onRunScan?: () => void;
}

export default function ProductsTab({
  companyName,
  data,
  isLoading,
  error,
  onRunScan,
}: ProductsTabProps) {
  // 1. Error State
  if (error) {
    return (
      <div className="py-12 flex items-center justify-center">
        <div className="w-full max-w-lg rounded-xl border border-red-500/20 bg-red-950/5 p-8 text-center space-y-5">
          <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 mx-auto">
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-bold text-red-200">Taxonomy Pipeline Error</h3>
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-4 w-40 bg-slate-800 rounded animate-pulse mb-2" />
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="p-4 rounded-xl border border-white/[0.04] bg-white/[0.01] flex items-center justify-between animate-pulse"
            >
              <div className="space-y-2 flex-1">
                <div className="h-3 w-1/3 bg-slate-800 rounded" />
                <div className="h-2.5 w-2/3 bg-slate-800/60 rounded" />
              </div>
              <div className="h-5 w-16 bg-slate-800 rounded" />
            </div>
          ))}
        </div>

        <div className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.01] flex flex-col items-center justify-center space-y-4">
          <div className="h-4 w-32 bg-slate-800 rounded animate-pulse" />
          <div className="w-32 h-32 rounded-full border-[10px] border-slate-800/40 border-t-slate-700/60 animate-spin" style={{ animationDuration: "3s" }} />
          <div className="space-y-2 w-full">
            <div className="h-2.5 w-full bg-slate-800 rounded animate-pulse" />
            <div className="h-2.5 w-2/3 bg-slate-800 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // 3. Standby State (Empty)
  if (!data) {
    return (
      <div className="space-y-6 relative min-h-[500px]">
        {/* Blurred background content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pointer-events-none select-none blur-[4px] opacity-25">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-4 w-40 bg-slate-800 rounded mb-2" />
            {[1, 2, 3].map((item) => (
              <div key={item} className="p-4 rounded-xl border border-white/[0.04] bg-white/[0.01] flex justify-between">
                <div className="h-3 w-1/3 bg-slate-800 rounded" />
                <div className="h-5 w-16 bg-slate-800 rounded" />
              </div>
            ))}
          </div>
          <div className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.01] flex flex-col items-center justify-center space-y-4">
            <div className="w-32 h-32 rounded-full border-[10px] border-slate-800" />
          </div>
        </div>

        {/* Standby State */}
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full max-w-lg rounded-xl border border-white/[0.08] bg-[#090d22]/80 backdrop-blur-md p-8 text-center space-y-6 shadow-2xl relative"
          >
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-brand-secondary/10 rounded-full blur-2xl -z-10" />

            <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-white/[0.02] border border-white/[0.08] mx-auto group">
              <Layers className="w-6 h-6 text-brand-accent group-hover:scale-105 transition-transform" />
              <div className="absolute inset-0 -z-10 rounded-2xl bg-brand-accent/5 blur-sm" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white tracking-tight">Product Taxonomy Offline</h3>
              <p className="text-sm text-slate-400 leading-relaxed max-w-sm mx-auto">
                Awaiting crawler deployment. Running the scan will analyze business segments, list core product lines, and construct market share breakdowns from segment revenue filings.
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Product List */}
      <div className="lg:col-span-2 space-y-4">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-2">
          Segment & Product Lines
        </h3>
        {data.map((prod, idx) => (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            key={prod.id}
            className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.01] hover:bg-white/[0.03] transition-all flex items-center justify-between gap-4"
          >
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-slate-200">{prod.name}</h4>
                <span className="text-[9px] font-semibold text-brand-accent bg-brand-primary/10 border border-brand-primary/20 px-1.5 rounded">
                  {prod.revenueSegment}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{prod.description}</p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-xs font-bold text-slate-300 block">Est. Share</span>
              <span className="text-sm font-extrabold text-brand-accent">{prod.marketShare}%</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Segment Breakdown Summary Card */}
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.01] flex flex-col items-center justify-center space-y-5 text-center relative overflow-hidden"
      >
        <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-brand-accent/5 rounded-full blur-xl" />
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
          Market Intensity
        </h3>

        {/* Circular Chart Representation */}
        <div className="relative w-36 h-36 flex items-center justify-center">
          {/* Inner Text */}
          <div className="absolute flex flex-col items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Primary Share</span>
            <span className="text-xl font-black text-white">
              {data.length > 0 ? Math.max(...data.map(p => p.marketShare)) : 0}%
            </span>
          </div>
          {/* Decorative Gradient SVG Ring */}
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              className="stroke-slate-800"
              strokeWidth="6"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              className="stroke-brand-accent"
              strokeWidth="6"
              fill="transparent"
              strokeDasharray="250"
              strokeDashoffset={250 - (250 * (data.length > 0 ? Math.max(...data.map(p => p.marketShare)) : 0)) / 100}
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="space-y-2 w-full">
          {data.map((prod) => (
            <div key={prod.id} className="flex justify-between items-center text-[10px] text-slate-400 border-b border-white/[0.02] pb-1.5 last:border-0 last:pb-0">
              <span className="font-semibold truncate max-w-[140px] text-slate-300 text-left">{prod.name}</span>
              <span className="font-bold text-brand-accent">{prod.marketShare}%</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
