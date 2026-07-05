"use client";

import React from "react";
import { motion } from "framer-motion";
import { Smile, Sparkles, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SentimentData } from "@/lib/api";

interface SentimentTabProps {
  companyName: string;
  data?: SentimentData;
  isLoading?: boolean;
  error?: string;
  onRunScan?: () => void;
}

export default function SentimentTab({
  companyName,
  data,
  isLoading,
  error,
  onRunScan,
}: SentimentTabProps) {
  // Helper to map score (0-100) to rotation degrees (-90 to +90)
  const getNeedleRotation = (score: number) => {
    return (score / 100) * 180 - 90;
  };

  // 1. Error State
  if (error) {
    return (
      <div className="py-12 flex items-center justify-center">
        <div className="w-full max-w-lg rounded-xl border border-red-500/20 bg-red-950/5 p-8 text-center space-y-5">
          <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 mx-auto">
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-bold text-red-200">Sentiment Analyzer Error</h3>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((idx) => (
          <div
            key={idx}
            className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.01] flex flex-col items-center justify-center space-y-4 text-center animate-pulse"
          >
            <span className="h-3 w-32 bg-slate-800 rounded" />
            <div className="w-24 h-12 rounded-t-full border-4 border-b-0 border-slate-800 relative" />
            <div className="h-3 w-16 bg-slate-800 rounded" />
          </div>
        ))}
      </div>
    );
  }

  // 3. Standby State (Empty)
  if (!data) {
    return (
      <div className="space-y-6 relative min-h-[500px]">
        {/* Blurred background cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pointer-events-none select-none blur-[4px] opacity-25">
          {[
            { title: "Social Sentiment (X / Reddit)" },
            { title: "Earnings Call Sentiment" },
            { title: "Employee Sentiment (Glassdoor)" },
          ].map((card, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.01] flex flex-col items-center justify-center space-y-4 text-center"
            >
              <span className="text-xs font-semibold text-slate-300">{card.title}</span>
              <div className="w-24 h-12 rounded-t-full border-4 border-b-0 border-slate-800 relative">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-8 bg-slate-800 rounded-full origin-bottom" style={{ transform: "translateX(-50%) rotate(-45deg)" }} />
              </div>
              <div className="h-3 w-16 bg-slate-800 rounded animate-pulse" />
            </div>
          ))}
        </div>

        {/* Foreground Beautiful Empty State */}
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full max-w-lg rounded-xl border border-white/[0.08] bg-[#090d22]/80 backdrop-blur-md p-8 text-center space-y-6 shadow-2xl relative"
          >
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-brand-secondary/10 rounded-full blur-2xl -z-10" />

            <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-white/[0.02] border border-white/[0.08] mx-auto group">
              <Smile className="w-6 h-6 text-brand-accent group-hover:scale-105 transition-transform" />
              <div className="absolute inset-0 -z-10 rounded-2xl bg-brand-accent/5 blur-sm" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white tracking-tight">Sentiment Analyzer Standby</h3>
              <p className="text-sm text-slate-400 leading-relaxed max-w-sm mx-auto">
                Stakeholder sentiment monitors are offline. Ingesting social streams, scraping earnings transcripts, and mapping employee review scores will activate upon running the scan.
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
  const sentimentGauges = [
    { title: "Social Sentiment (X / Reddit)", score: data.socialSentiment.score, label: data.socialSentiment.label },
    { title: "Earnings Call Sentiment", score: data.earningsCallSentiment.score, label: data.earningsCallSentiment.label },
    { title: "Employee Sentiment (Glassdoor)", score: data.employeeSentiment.score, label: data.employeeSentiment.label }
  ];

  return (
    <div className="space-y-6">
      {/* 3 Dial Gauges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sentimentGauges.map((card, idx) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            key={idx}
            className="p-6 rounded-xl border border-white/[0.06] bg-white/[0.01] hover:bg-white/[0.02] hover:border-white/[0.08] transition-all flex flex-col items-center justify-center space-y-4 text-center relative overflow-hidden"
          >
            <div className="absolute -top-12 -right-12 w-20 h-20 bg-brand-primary/5 rounded-full blur-xl" />
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">{card.title}</span>
            
            {/* Real-time Dial Gauge */}
            <div className="w-28 h-14 rounded-t-full border-4 border-b-0 border-white/[0.08] relative overflow-hidden flex items-end justify-center">
              {/* Active arc gradient */}
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-secondary/20 to-brand-accent/20 rounded-t-full -z-10" />
              {/* Rotating Needle */}
              <motion.div
                initial={{ rotate: -90 }}
                animate={{ rotate: getNeedleRotation(card.score) }}
                transition={{ duration: 1.2, ease: "easeOut", delay: idx * 0.1 }}
                className="absolute bottom-0 left-1/2 w-1 h-10 bg-brand-accent rounded-full origin-bottom"
                style={{ transform: "translateX(-50%)" }}
              />
              {/* Center Cap */}
              <div className="w-3.5 h-3.5 rounded-full bg-[#050816] border border-brand-accent/40 absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-10" />
            </div>
            
            <div className="space-y-1">
              <span className="text-sm font-black text-white font-mono">{card.score}%</span>
              <p className="text-[10px] text-slate-400 font-semibold">{card.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Sentiment Distribution Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.01] space-y-4"
      >
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-slate-200 uppercase tracking-wider">Stakeholder Net Sentiment Ratio</span>
          <div className="flex gap-4 font-semibold text-[10px]">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              {data.positive}% Positive
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <span className="w-2 h-2 rounded-full bg-slate-500" />
              {data.neutral}% Neutral
            </span>
            <span className="flex items-center gap-1 text-red-400">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              {data.negative}% Negative
            </span>
          </div>
        </div>

        {/* Dynamic segmented progress bar */}
        <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden flex">
          <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${data.positive}%` }} />
          <div className="bg-slate-500 h-full transition-all duration-500" style={{ width: `${data.neutral}%` }} />
          <div className="bg-red-500 h-full transition-all duration-500" style={{ width: `${data.negative}%` }} />
        </div>
      </motion.div>
    </div>
  );
}
