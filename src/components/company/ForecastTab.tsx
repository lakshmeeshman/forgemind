"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Lock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Forecast } from "@/lib/api";

interface ForecastTabProps {
  companyName: string;
  data?: Forecast[];
  isLoading?: boolean;
  error?: string;
  onRunScan?: () => void;
}

export default function ForecastTab({
  companyName,
  data,
  isLoading,
  error,
  onRunScan,
}: ForecastTabProps) {
  const [selectedScenario, setSelectedScenario] = useState<"Base" | "Optimistic" | "Pessimistic">("Base");

  // 1. Error State
  if (error) {
    return (
      <div className="py-12 flex items-center justify-center">
        <div className="w-full max-w-lg rounded-xl border border-red-500/20 bg-red-950/5 p-8 text-center space-y-5">
          <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 mx-auto">
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-bold text-red-200">Forecasting Engine Error</h3>
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
        <div className="border border-white/[0.06] bg-white/[0.01] rounded-xl p-6 animate-pulse">
          <div className="h-4 w-40 bg-slate-800 rounded mb-6" />
          <div className="relative h-64 border-l border-b border-white/10 ml-8 mb-4">
            <div className="absolute left-0 right-0 top-1/3 border-t border-dashed border-white/5" />
            <div className="absolute left-0 right-0 top-2/3 border-t border-dashed border-white/5" />
          </div>
        </div>
      </div>
    );
  }

  // 3. Standby State (Empty)
  if (!data) {
    return (
      <div className="space-y-6 relative min-h-[500px]">
        {/* Blurred background Coordinate Grid Chart */}
        <div className="border border-white/[0.06] bg-white/[0.01] rounded-xl p-6 pointer-events-none select-none blur-[4px] opacity-25">
          <div className="h-4 w-40 bg-slate-800 rounded mb-6" />
          <div className="relative h-64 border-l border-b border-white/20 ml-8 mb-4">
            <div className="absolute -left-8 top-0 text-[10px] text-slate-500">$500B</div>
            <div className="absolute -left-8 top-1/2 -translate-y-1/2 text-[10px] text-slate-500">$250B</div>
            <div className="absolute -left-8 bottom-0 text-[10px] text-slate-500">$0B</div>
            <div className="absolute -bottom-6 left-0 text-[10px] text-slate-500">2026</div>
            <div className="absolute left-0 right-0 top-1/3 border-t border-dashed border-white/5" />
            <div className="absolute inset-0 overflow-hidden flex items-end">
              <svg className="w-full h-full text-brand-primary" fill="none">
                <path d="M 0 200 Q 150 150 300 100 T 600 20" stroke="currentColor" strokeWidth="3" strokeDasharray="6 6" className="opacity-40" />
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
            <div className="absolute -top-12 -left-12 w-32 h-32 bg-brand-primary/10 rounded-full blur-2xl -z-10" />

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

  // 4. Data Loaded State
  // Extract historic data (usually has no scenario tag or is Base, labeled e.g. "2024")
  const baseScenario = data.filter((d) => d.scenario === "Base");
  const optScenario = data.filter((d) => d.scenario === "Optimistic");
  const pesScenario = data.filter((d) => d.scenario === "Pessimistic");

  // Determine active display data
  const displayedScenario =
    selectedScenario === "Optimistic"
      ? [...baseScenario.slice(0, 1), ...optScenario]
      : selectedScenario === "Pessimistic"
      ? [...baseScenario.slice(0, 1), ...pesScenario]
      : baseScenario;

  // Simple projection math for plotting:
  // X: 5 points (0, 25%, 50%, 75%, 100% width)
  // Y: Max revenue determines top height
  const maxRevenue = Math.max(...data.map((d) => d.revenue)) * 1.25 || 100;
  
  const getPointsString = (series: Forecast[]) => {
    return series
      .map((d, idx) => {
        const x = (idx / (series.length - 1)) * 520 + 30; // Scale X inside [30, 550]
        const y = 180 - (d.revenue / maxRevenue) * 150; // Scale Y inside [30, 180]
        return `${x},${y}`;
      })
      .join(" ");
  };

  const basePoints = getPointsString(baseScenario);
  const optPoints = getPointsString([...baseScenario.slice(0, 1), ...optScenario]);
  const pesPoints = getPointsString([...baseScenario.slice(0, 1), ...pesScenario]);

  return (
    <div className="space-y-6">
      {/* Header and Scenario Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
          5-Year Revenue Forecast Models
        </h3>

        <div className="flex gap-1 bg-white/[0.02] border border-white/[0.06] p-1 rounded-lg">
          {(["Base", "Optimistic", "Pessimistic"] as const).map((scen) => (
            <button
              key={scen}
              onClick={() => setSelectedScenario(scen)}
              className={`px-3 py-1 text-[10px] font-bold rounded-md transition-colors cursor-pointer select-none ${
                selectedScenario === scen
                  ? "bg-white/[0.05] border border-white/[0.08] text-brand-accent"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {scen} Model
            </button>
          ))}
        </div>
      </div>

      {/* SVG Projection Plot */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="border border-white/[0.06] bg-[#050816]/30 backdrop-blur-md rounded-xl p-6"
      >
        <div className="relative h-64 ml-8 mb-4">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            <div className="w-full border-t border-dashed border-white/[0.03]" />
            <div className="w-full border-t border-dashed border-white/[0.03]" />
            <div className="w-full border-t border-dashed border-white/[0.03]" />
            <div className="w-full border-t border-white/[0.08]" />
          </div>

          {/* Y Axis markings */}
          <div className="absolute -left-10 top-0 text-[9px] font-mono font-bold text-slate-500">
            ${maxRevenue.toFixed(0)}B
          </div>
          <div className="absolute -left-10 top-1/2 -translate-y-1/2 text-[9px] font-mono font-bold text-slate-500">
            ${(maxRevenue / 2).toFixed(0)}B
          </div>
          <div className="absolute -left-10 bottom-0 text-[9px] font-mono font-bold text-slate-500">
            $0B
          </div>

          {/* SVG Canvas */}
          <svg className="w-full h-full absolute inset-0 overflow-visible" fill="none">
            {/* Optimistic Path (Green dotted) */}
            <polyline
              points={optPoints}
              stroke="#10b981"
              strokeWidth="2"
              strokeDasharray="4 4"
              className={selectedScenario === "Optimistic" ? "opacity-100" : "opacity-30"}
            />
            {/* Base Path (Accent solid) */}
            <polyline
              points={basePoints}
              stroke="#00ffff"
              strokeWidth="3"
              className={selectedScenario === "Base" ? "opacity-100" : "opacity-30"}
            />
            {/* Pessimistic Path (Red dotted) */}
            <polyline
              points={pesPoints}
              stroke="#f59e0b"
              strokeWidth="2"
              strokeDasharray="4 4"
              className={selectedScenario === "Pessimistic" ? "opacity-100" : "opacity-30"}
            />
            
            {/* Dots on active line */}
            {displayedScenario.map((d, idx) => {
              const x = (idx / (displayedScenario.length - 1)) * 520 + 30;
              const y = 180 - (d.revenue / maxRevenue) * 150;
              return (
                <g key={idx}>
                  <circle
                    cx={x}
                    cy={y}
                    r="4"
                    fill={
                      selectedScenario === "Optimistic"
                        ? "#10b981"
                        : selectedScenario === "Pessimistic"
                        ? "#f59e0b"
                        : "#00ffff"
                    }
                  />
                </g>
              );
            })}
          </svg>

          {/* X Axis markings */}
          <div className="absolute -bottom-6 inset-x-0 flex justify-between text-[9px] font-mono font-bold text-slate-500 px-4">
            {baseScenario.map((d) => (
              <span key={d.year}>{d.year}</span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Projection Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="border border-white/[0.06] bg-white/[0.01] rounded-xl overflow-hidden"
      >
        <div className="grid grid-cols-4 p-4 border-b border-white/[0.06] bg-white/[0.02] text-slate-400 font-bold text-xs tracking-wider uppercase">
          <div>Projection Year</div>
          <div className="text-right">Projected Revenue</div>
          <div className="text-right">Estimated Growth</div>
          <div className="text-right">Projected EBITDA</div>
        </div>
        <div className="divide-y divide-white/[0.04] font-mono text-xs">
          {displayedScenario.map((item, idx) => (
            <div key={idx} className="grid grid-cols-4 p-4 hover:bg-white/[0.01] text-slate-300">
              <span className="font-sans font-semibold text-slate-200">{item.year}</span>
              <div className="text-right font-semibold">${item.revenue.toFixed(1)}B</div>
              <div className="text-right font-semibold text-emerald-400">{item.growth.toFixed(1)}%</div>
              <div className="text-right font-semibold">${item.ebitda.toFixed(1)}B</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
