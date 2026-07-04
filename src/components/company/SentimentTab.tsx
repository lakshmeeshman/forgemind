"use client";

import React from "react";
import { motion } from "framer-motion";
import { Smile, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SentimentTabProps {
  companyName: string;
  onRunScan?: () => void;
}

export default function SentimentTab({ companyName, onRunScan }: SentimentTabProps) {
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
            {/* Skeletal Dial Gauge */}
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
          {/* Decorative Glow */}
          <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-brand-secondary/10 rounded-full blur-2xl -z-10" />

          {/* Icon */}
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
