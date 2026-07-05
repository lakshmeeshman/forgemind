"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, FileSpreadsheet, AlertTriangle, ShieldCheck, Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExecutiveSummary, reportApi } from "@/lib/api";

interface ExecutiveSummaryTabProps {
  companyName: string;
  data?: ExecutiveSummary;
  isLoading?: boolean;
  error?: string;
  onRunScan?: () => void;
}

export default function ExecutiveSummaryTab({
  companyName,
  data,
  isLoading,
  error,
  onRunScan,
}: ExecutiveSummaryTabProps) {
  const [isCompiling, setIsCompiling] = useState(false);

  const handleDownloadPdf = async () => {
    setIsCompiling(true);
    try {
      const slug = companyName.toLowerCase().split(" ")[0];
      await reportApi.compileReport(slug, companyName);
      alert(`Executive briefing PDF for ${companyName} compiled successfully! Available in Documents.`);
    } catch {
      alert("Failed to compile executive summary PDF.");
    } finally {
      setIsCompiling(false);
    }
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
            <h3 className="text-base font-bold text-red-200">Agent Synthesis Error</h3>
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
        <div className="p-8 border border-white/[0.06] bg-white/[0.01] rounded-xl space-y-6 animate-pulse">
          <div className="flex justify-between items-start border-b border-white/[0.08] pb-4">
            <div className="space-y-2">
              <div className="h-4 w-56 bg-slate-800 rounded" />
              <div className="h-3 w-32 bg-slate-800/80 rounded" />
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-800" />
          </div>
          <div className="space-y-3">
            <div className="h-3.5 w-32 bg-slate-800 rounded" />
            <div className="space-y-2">
              <div className="h-2.5 w-full bg-slate-800/60 rounded" />
              <div className="h-2.5 w-full bg-slate-800/60 rounded" />
              <div className="h-2.5 w-11/12 bg-slate-800/60 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. Standby State (Empty)
  if (!data) {
    return (
      <div className="space-y-6 relative min-h-[500px]">
        {/* Blurred background document briefing */}
        <div className="p-8 border border-white/[0.06] bg-white/[0.01] rounded-xl space-y-6 pointer-events-none select-none blur-[4.5px] opacity-20">
          <div className="flex justify-between items-start border-b border-white/[0.08] pb-4">
            <div className="space-y-2">
              <div className="h-4 w-56 bg-slate-800 rounded" />
              <div className="h-3 w-32 bg-slate-800/80 rounded" />
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-3.5 w-32 bg-slate-800 rounded" />
            <div className="h-2.5 w-full bg-slate-800/60 rounded" />
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
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-brand-primary/10 rounded-full blur-2xl -z-10" />

            <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-white/[0.02] border border-white/[0.08] mx-auto group">
              <FileSpreadsheet className="w-6 h-6 text-brand-accent group-hover:scale-105 transition-transform" />
              <div className="absolute inset-0 -z-10 rounded-2xl bg-brand-accent/5 blur-sm" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white tracking-tight">AI Report Compiler Standby</h3>
              <p className="text-sm text-slate-400 leading-relaxed max-w-sm mx-auto">
                LangGraph agent synthesis is currently offline. Dispatches of the crawler pipeline will trigger the agent to compile a comprehensive executive briefing, detailing risk scores and SWOT factors.
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

  // Helper to resolve risk rating color
  const getRiskColor = (score: number) => {
    if (score < 35) return "text-emerald-400 bg-emerald-950/20 border-emerald-500/20";
    if (score < 65) return "text-amber-400 bg-amber-950/20 border-amber-500/20";
    return "text-red-400 bg-red-950/20 border-red-500/20";
  };

  const getRiskLabel = (score: number) => {
    if (score < 35) return "Low Operational Risk";
    if (score < 65) return "Moderate Vulnerability";
    return "High Operational Risk";
  };

  // 4. Data Loaded State
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 border border-white/[0.06] bg-white/[0.01] rounded-xl space-y-6 relative overflow-hidden"
    >
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-brand-primary/5 rounded-full blur-3xl" />

      {/* Document Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/[0.08] pb-5 gap-4 relative z-10">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">
            LangGraph Executive Briefing
          </h3>
          <p className="text-[10px] text-slate-400 mt-1">
            {data.compiledBy} • Compiled on {data.compiledAt}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Risk Badge */}
          <div className={`px-2.5 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-wider ${getRiskColor(data.riskScore)}`}>
            {getRiskLabel(data.riskScore)} ({data.riskScore}/100)
          </div>

          <Button
            size="sm"
            onClick={handleDownloadPdf}
            disabled={isCompiling}
            className="bg-brand-primary hover:bg-brand-primary/90 text-white text-[10px] font-bold px-3 h-8 cursor-pointer inline-flex items-center gap-1"
          >
            {isCompiling ? (
              <RefreshCw className="w-3 h-3 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            Compile PDF
          </Button>
        </div>
      </div>

      {/* Brief Section */}
      <div className="space-y-2.5 relative z-10">
        <h4 className="text-xs font-bold text-brand-accent uppercase tracking-wider flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4" />
          Synthesis Thesis
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed font-medium">
          {data.briefing}
        </p>
      </div>

      {/* Recommendations */}
      <div className="space-y-3 relative z-10 pt-4 border-t border-white/[0.04]">
        <h4 className="text-xs font-bold text-brand-accent uppercase tracking-wider">
          AI Actionable Recommendations
        </h4>
        <ul className="space-y-2">
          {data.recommendations.map((rec, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
              <span className="text-brand-accent font-bold mt-0.5 shrink-0">#{idx + 1}</span>
              <span className="leading-relaxed text-slate-300 font-medium">{rec}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Agent Signatures */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-white/[0.06] relative z-10">
        {data.signatures.map((sig, idx) => (
          <div key={idx} className="space-y-1 bg-white/[0.01] border border-white/[0.04] p-3 rounded-lg">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Agent Signature</span>
            <div className="font-mono text-xs font-bold text-brand-accent tracking-tight italic pt-1">
              /{sig.name}/
            </div>
            <div className="text-[9px] text-slate-400 font-semibold">{sig.role}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
