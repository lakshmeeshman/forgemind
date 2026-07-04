"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Play, Sparkles, TrendingUp, Cpu, ShieldCheck } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-28 pb-20 overflow-hidden bg-[#050816] bg-grid-pattern">
      
      {/* Animated Glowing Gradients Backdrop */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Glow Purple */}
        <motion.div
          animate={{
            x: [0, 40, -20, 0],
            y: [0, -60, 40, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[20%] left-[10%] w-[35rem] h-[35rem] rounded-full bg-brand-primary/15 blur-[120px] pointer-events-none"
        />
        {/* Glow Blue */}
        <motion.div
          animate={{
            x: [0, -30, 50, 0],
            y: [0, 50, -40, 0],
            scale: [1, 0.9, 1.15, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-[20%] right-[10%] w-[40rem] h-[40rem] rounded-full bg-brand-secondary/10 blur-[130px] pointer-events-none"
        />
        {/* Glow Cyan Accent */}
        <motion.div
          animate={{
            x: [0, 50, -50, 0],
            y: [0, 60, 60, 0],
            scale: [1, 1.1, 0.8, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[30rem] h-[30rem] rounded-full bg-brand-accent/5 blur-[100px] pointer-events-none"
        />
        {/* Center Spotlight radial gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050816]/50 to-[#050816] pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center w-full">
        {/* Left Side: Typography and CTA */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          
          {/* Tag Pill */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] backdrop-blur-md mb-6"
          >
            <Sparkles className="w-4 h-4 text-brand-accent animate-pulse" />
            <span className="text-xs font-semibold tracking-wider uppercase text-slate-300">
              Enterprise Cognitive Intelligence
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1] mb-6"
          >
            Forge Raw Data Into{" "}
            <span className="text-gradient-rainbow">Executive Insight</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-slate-400 max-w-2xl mb-10 leading-relaxed"
          >
            ForgeMind digests unstructured financial filings, real-time market feeds, public filings, and news channels to construct decision-ready, high-fidelity corporate models for modern enterprises.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <a
              href="#pricing"
              className="w-full sm:w-auto bg-brand-primary hover:bg-brand-primary/95 text-white border-0 font-medium px-8 py-4 rounded-xl shadow-xl shadow-brand-primary/20 relative overflow-hidden group cursor-pointer inline-flex items-center justify-center transition-all duration-300"
            >
              <span className="relative z-10 flex items-center gap-2">
                Get Started Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-gradient-to-r from-brand-secondary to-brand-accent transition-transform duration-300 -z-0" />
            </a>
            <a
              href="#preview"
              className="w-full sm:w-auto border border-white/[0.08] hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.05] text-white hover:text-white font-medium px-8 py-4 rounded-xl backdrop-blur-md cursor-pointer transition-all inline-flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 text-brand-accent fill-brand-accent/20" />
              Watch Demo
            </a>
          </motion.div>

          {/* Core Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-12 flex flex-wrap items-center gap-6 text-xs text-slate-500 font-medium border-t border-white/[0.06] pt-6 w-full"
          >
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-accent" />
              <span>SOC2 Type II Certified</span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
            <div className="flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-brand-secondary" />
              <span>Sub-Second Vector Search</span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
            <span>ISO 27001 Compliant Infrastructure</span>
          </motion.div>
        </div>

        {/* Right Side: Interactive Visual Elements */}
        <div className="lg:col-span-5 relative w-full h-[450px] flex items-center justify-center">
          
          {/* Main Visual Centerpiece - Floating HUD Dashboard */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-[400px] glass-card rounded-2xl p-6 relative glow-primary z-20"
          >
            <div className="flex items-center justify-between mb-4 border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Forge Engine Live
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">SYS_OK v1.0.4</span>
            </div>

            {/* Simulated AI Output streams */}
            <div className="space-y-3.5">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-300">Data Pipeline Speed</span>
                  <span className="text-brand-accent">14.8k tokens/s</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "82%" }}
                    transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-brand-primary to-brand-accent rounded-full"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-300">Semantic Indexing Accuracy</span>
                  <span className="text-brand-secondary">99.84%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "95%" }}
                    transition={{ duration: 1.5, delay: 0.7, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-brand-secondary to-brand-accent rounded-full"
                  />
                </div>
              </div>
            </div>

            {/* Insight Output Card inside */}
            <div className="mt-5 p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] text-xs text-left">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-brand-accent font-semibold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Recommendation
                </span>
                <span className="text-[10px] text-slate-500">Just now</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                ForgeMind identified an emerging supply-chain deviation in APAC operations. Forecasted revenue impact: <span className="text-emerald-400 font-semibold">+1.4% margins</span>.
              </p>
            </div>
          </motion.div>

          {/* Floating Widget 1: Revenue Outlook Trend */}
          <motion.div
            animate={{
              y: [0, -12, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-4 -left-4 md:-left-8 glass-card rounded-xl p-4 flex items-center gap-3.5 max-w-[200px] z-30"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-left">
              <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                Revenue Outlook
              </div>
              <div className="text-sm font-bold text-white">+24.8% YoY</div>
            </div>
          </motion.div>

          {/* Floating Widget 2: Security Vector status */}
          <motion.div
            animate={{
              y: [0, 10, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
            className="absolute bottom-6 -right-2 md:-right-6 glass-card rounded-xl p-4 flex flex-col gap-2 max-w-[180px] z-30"
          >
            <div className="flex items-center justify-between gap-4">
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                Active Nodes
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse" />
            </div>
            <div className="flex items-baseline gap-1 text-left">
              <span className="text-base font-bold text-white">4,204</span>
              <span className="text-[10px] text-slate-500">/sec</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
