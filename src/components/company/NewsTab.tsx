"use client";

import React from "react";
import { motion } from "framer-motion";
import { Newspaper, Sparkles, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NewsArticle } from "@/lib/api";

interface NewsTabProps {
  companyName: string;
  data?: NewsArticle[];
  isLoading?: boolean;
  error?: string;
  onRunScan?: () => void;
}

export default function NewsTab({
  companyName,
  data,
  isLoading,
  error,
  onRunScan,
}: NewsTabProps) {
  // 1. Error State
  if (error) {
    return (
      <div className="py-12 flex items-center justify-center">
        <div className="w-full max-w-lg rounded-xl border border-red-500/20 bg-red-950/5 p-8 text-center space-y-5">
          <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 mx-auto">
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-bold text-red-200">Media Aggregation Error</h3>
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
      <div className="space-y-4">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="p-5 rounded-xl border border-white/[0.04] bg-white/[0.01] flex flex-col md:flex-row md:items-center justify-between gap-4 animate-pulse"
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <span className="h-3.5 w-16 bg-slate-800 rounded" />
                <span className="h-3.5 w-20 bg-slate-800/80 rounded" />
              </div>
              <div className="h-4 w-4/5 bg-slate-800 rounded" />
              <div className="h-3 w-11/12 bg-slate-800/60 rounded" />
            </div>
            <div className="w-10 h-10 rounded-full border-4 border-slate-800 shrink-0" />
          </div>
        ))}
      </div>
    );
  }

  // 3. Standby State (Empty)
  if (!data) {
    return (
      <div className="space-y-6 relative min-h-[500px]">
        {/* Blurred background News articles */}
        <div className="space-y-4 pointer-events-none select-none blur-[4px] opacity-25">
          {[1, 2].map((item) => (
            <div key={item} className="p-5 rounded-xl border border-white/[0.04] bg-white/[0.01] flex justify-between">
              <div className="space-y-2 flex-1">
                <div className="h-3 w-16 bg-slate-800 rounded" />
                <div className="h-4 w-3/4 bg-slate-800 rounded" />
              </div>
              <div className="w-10 h-10 rounded-full border-4 border-slate-800" />
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
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-brand-primary/10 rounded-full blur-2xl -z-10" />

            <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-white/[0.02] border border-white/[0.08] mx-auto group">
              <Newspaper className="w-6 h-6 text-brand-accent group-hover:scale-105 transition-transform" />
              <div className="absolute inset-0 -z-10 rounded-2xl bg-brand-accent/5 blur-sm" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white tracking-tight">Real-time News Stream Offline</h3>
              <p className="text-sm text-slate-400 leading-relaxed max-w-sm mx-auto">
                Real-time media feeds are standby. Once you run the scan, our systems will ingest RSS feeds, Google News headlines, and official PR statements to track corporate events.
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
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-2">
        Recent Media Intelligence
      </h3>
      
      {data.map((article, idx) => {
        const isPos = article.sentiment === "positive";
        const isNeg = article.sentiment === "negative";

        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            key={article.id}
            className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.01] hover:bg-white/[0.02] hover:border-white/[0.08] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-brand-accent bg-brand-primary/10 border border-brand-primary/20 px-2 py-0.5 rounded">
                  {article.source}
                </span>
                <span className="text-[10px] font-medium text-slate-500">
                  {article.publishedAt}
                </span>
              </div>
              
              <a
                href={article.url}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-bold text-slate-200 hover:text-white hover:underline transition-all block leading-tight"
              >
                {article.title}
              </a>
              
              <p className="text-xs text-slate-400 leading-relaxed">
                {article.summary}
              </p>
            </div>

            {/* Sentiment Ring Badge */}
            <div className="flex items-center gap-3 shrink-0 self-end md:self-auto border-t md:border-t-0 border-white/[0.04] pt-2.5 md:pt-0">
              <div className="text-right">
                <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Impact Score</span>
                <span className="text-xs font-mono font-bold text-slate-300">{article.impactScore}/10</span>
              </div>
              
              <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-[10px] uppercase ${
                isPos
                  ? "border-emerald-500/30 text-emerald-400 bg-emerald-950/10"
                  : isNeg
                  ? "border-red-500/30 text-red-400 bg-red-950/10"
                  : "border-slate-500/30 text-slate-400 bg-slate-950/10"
              }`}>
                {article.sentiment.substring(0, 3)}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
