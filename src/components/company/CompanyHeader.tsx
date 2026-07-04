"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, User, Calendar, DollarSign, RefreshCw, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CompanyHeaderProps {
  name: string;
  industry: string;
  headquarters: string;
  ceo: string;
  founded: string | number;
  marketCap: string;
}

export default function CompanyHeader({
  name,
  industry,
  headquarters,
  ceo,
  founded,
  marketCap,
}: CompanyHeaderProps) {
  const [scanState, setScanState] = useState<"idle" | "scanning" | "completed">("idle");

  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const handleScan = () => {
    if (scanState !== "idle") return;
    setScanState("scanning");
    setTimeout(() => {
      setScanState("completed");
      setTimeout(() => {
        setScanState("idle");
      }, 3000);
    }, 4000);
  };

  return (
    <div className="p-6 rounded-xl border border-white/[0.06] bg-white/[0.01] backdrop-blur-md relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl -z-10" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        {/* Left Section: Logo & Details */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Logo Placeholder */}
          <div className="relative group shrink-0">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-tr from-brand-primary via-brand-secondary to-brand-accent p-[1px] shadow-lg shadow-brand-primary/10">
              <div className="w-full h-full bg-[#050816] rounded-xl flex items-center justify-center font-bold text-lg text-white tracking-wider group-hover:scale-[0.98] transition-transform">
                {initials}
              </div>
            </div>
            <div className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-accent opacity-30 blur-md group-hover:opacity-50 transition-opacity" />
          </div>

          {/* Company Details */}
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-extrabold text-white tracking-tight">{name}</h1>
              <span className="text-[10px] font-bold text-slate-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded">
                ACTIVE PROFILE
              </span>
            </div>
            
            <p className="text-sm text-brand-accent font-medium">{industry}</p>

            {/* Quick Metadata Row */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400 pt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                {headquarters}
              </span>
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-500" />
                {ceo}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                Founded {founded}
              </span>
            </div>
          </div>
        </div>

        {/* Right Section: Market Cap & Scan Button */}
        <div className="flex flex-row sm:flex-col lg:flex-row items-center justify-between sm:items-start lg:items-center gap-4 lg:gap-6 border-t lg:border-t-0 border-white/[0.06] pt-4 lg:pt-0 shrink-0">
          {/* Market Cap Info */}
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Market Capitalization
            </span>
            <div className="flex items-center gap-1 text-slate-200">
              <DollarSign className="w-4 h-4 text-brand-accent" />
              <span className="text-xl font-bold tracking-tight">{marketCap}</span>
              <span className="text-[9px] text-slate-500 font-semibold bg-white/5 px-1 py-0.5 rounded ml-1 border border-white/5">
                ESTIMATE
              </span>
            </div>
          </div>

          {/* Trigger Scan Button */}
          <Button
            onClick={handleScan}
            disabled={scanState === "scanning"}
            className={`font-semibold text-xs h-9 px-4 cursor-pointer relative overflow-hidden transition-all duration-300 ${
              scanState === "scanning"
                ? "bg-brand-primary/20 text-brand-accent border border-brand-primary/30"
                : scanState === "completed"
                ? "bg-emerald-600 hover:bg-emerald-600 text-white"
                : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
            }`}
          >
            <span className="relative z-10 flex items-center gap-1.5">
              {scanState === "scanning" ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-brand-accent" />
                  Running AI Synthesis...
                </>
              ) : scanState === "completed" ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  Crawl Dispatched
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-brand-accent" />
                  Run Pipeline Scan
                </>
              )}
            </span>
            {scanState === "scanning" && (
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-primary/10 to-transparent -z-10"
              />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
