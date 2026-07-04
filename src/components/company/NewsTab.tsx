"use client";

import React from "react";
import { motion } from "framer-motion";
import { Newspaper, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NewsTabProps {
  companyName: string;
  onRunScan?: () => void;
}

export default function NewsTab({ companyName, onRunScan }: NewsTabProps) {
  return (
    <div className="space-y-6 relative min-h-[500px]">
      {/* Blurred background News articles */}
      <div className="space-y-4 pointer-events-none select-none blur-[4px] opacity-25">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="p-5 rounded-xl border border-white/[0.04] bg-white/[0.01] flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <span className="h-3 w-16 bg-slate-800 rounded animate-pulse" />
                <span className="h-3.5 w-20 bg-slate-800/80 rounded animate-pulse" />
              </div>
              <div className="h-4 w-4/5 bg-slate-800 rounded animate-pulse" />
              <div className="h-3.5 w-11/12 bg-slate-800/60 rounded animate-pulse" />
            </div>
            {/* Empty Sentiment Ring */}
            <div className="w-10 h-10 rounded-full border-4 border-slate-800 shrink-0" />
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
          {/* Decorative Glow */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-brand-primary/10 rounded-full blur-2xl -z-10" />

          {/* Icon */}
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
