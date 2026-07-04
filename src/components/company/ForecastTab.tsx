"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ForecastTabProps {
  companyName: string;
  onRunScan?: () => void;
}

export default function ForecastTab({ companyName, onRunScan }: ForecastTabProps) {
  return (
    <div className="space-y-6 relative min-h-[500px]">
      {/* Blurred background Coordinate Grid Chart */}
      <div className="border border-white/[0.06] bg-white/[0.01] rounded-xl p-6 pointer-events-none select-none blur-[4px] opacity-25">
        <div className="h-4 w-40 bg-slate-800 rounded animate-pulse mb-6" />

        {/* Skeletal Graph coordinate system */}
        <div className="relative h-64 border-l border-b border-white/20 ml-8 mb-4">
          {/* Y Axis markings */}
          <div className="absolute -left-8 top-0 text-[10px] text-slate-500">$500B</div>
          <div className="absolute -left-8 top-1/2 -translate-y-1/2 text-[10px] text-slate-500">$250B</div>
          <div className="absolute -left-8 bottom-0 text-[10px] text-slate-500">$0B</div>

          {/* X Axis markings */}
          <div className="absolute -bottom-6 left-0 text-[10px] text-slate-500">2026</div>
          <div className="absolute -bottom-6 left-1/3 text-[10px] text-slate-500">2028 (Proj)</div>
          <div className="absolute -bottom-6 left-2/3 text-[10px] text-slate-500">2030 (Proj)</div>

          {/* Grid lines */}
          <div className="absolute left-0 right-0 top-1/3 border-t border-dashed border-white/5" />
          <div className="absolute left-0 right-0 top-2/3 border-t border-dashed border-white/5" />

          {/* Blurred line chart */}
          <div className="absolute inset-0 overflow-hidden flex items-end">
            <svg className="w-full h-full text-brand-primary" fill="none">
              <path
                d="M 0 200 Q 150 150 300 100 T 600 20"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray="6 6"
                className="opacity-40"
              />
            </svg>
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
          <div className="absolute -top-12 -left-12 w-32 h-32 bg-brand-primary/10 rounded-full blur-2xl -z-10" />

          {/* Icon */}
          <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-white/[0.02] border border-white/[0.08] mx-auto group">
            <Lock className="w-6 h-6 text-brand-accent group-hover:scale-105 transition-transform" />
            <div className="absolute inset-0 -z-10 rounded-2xl bg-brand-accent/5 blur-sm" />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white tracking-tight">Forecasting Models Offline</h3>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm mx-auto">
              Predictive intelligence engine is standby. Connect historical financial statements to train regression and ARIMA forecasting models for 5-year corporate projections.
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
