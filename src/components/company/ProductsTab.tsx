"use client";

import React from "react";
import { motion } from "framer-motion";
import { Layers, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductsTabProps {
  companyName: string;
  onRunScan?: () => void;
}

export default function ProductsTab({ companyName, onRunScan }: ProductsTabProps) {
  return (
    <div className="space-y-6 relative min-h-[500px]">
      {/* Blurred background content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pointer-events-none select-none blur-[4px] opacity-25">
        {/* Mock Product List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="h-4 w-40 bg-slate-800 rounded animate-pulse mb-2" />
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="p-4 rounded-xl border border-white/[0.04] bg-white/[0.01] flex items-center justify-between"
            >
              <div className="space-y-2 flex-1">
                <div className="h-3 w-1/3 bg-slate-800 rounded animate-pulse" />
                <div className="h-2.5 w-2/3 bg-slate-800/60 rounded animate-pulse" />
              </div>
              <div className="h-5 w-16 bg-slate-800 rounded animate-pulse" />
            </div>
          ))}
        </div>

        {/* Mock Chart Segment */}
        <div className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.01] flex flex-col items-center justify-center space-y-4">
          <div className="h-4 w-32 bg-slate-800 rounded animate-pulse" />
          {/* Pie chart skeleton */}
          <div className="w-32 h-32 rounded-full border-[10px] border-slate-800/40 border-t-slate-700/60 animate-spin" style={{ animationDuration: "3s" }} />
          <div className="space-y-2 w-full">
            <div className="flex justify-between">
              <div className="h-2.5 w-12 bg-slate-800 rounded animate-pulse" />
              <div className="h-2.5 w-8 bg-slate-800 rounded animate-pulse" />
            </div>
            <div className="flex justify-between">
              <div className="h-2.5 w-16 bg-slate-800 rounded animate-pulse" />
              <div className="h-2.5 w-6 bg-slate-800 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Foreground Empty State */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-lg rounded-xl border border-white/[0.08] bg-[#090d22]/80 backdrop-blur-md p-8 text-center space-y-6 shadow-2xl relative"
        >
          {/* Gradient */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-brand-secondary/10 rounded-full blur-2xl -z-10" />

          {/* Icon */}
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
