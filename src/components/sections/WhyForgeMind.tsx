"use client";

import React from "react";
import { motion } from "framer-motion";
import { Database, Network, Cpu, FileCheck } from "lucide-react";

export default function WhyForgeMind() {
  const steps = [
    {
      number: "01",
      title: "Real-time Raw Data Ingestion",
      icon: <Database className="w-5 h-5 text-brand-primary" />,
      description: "Our pipelines continuously crawl and digest raw public records, SEC filings, news cycles, earnings transcript audio files, and regional logistics data points as they occur.",
      technical: "Monitors 40k+ public endpoints, utilizing real-time OCR and speech-to-text pipeline parsing.",
    },
    {
      number: "02",
      title: "Semantic Vector Alignment",
      icon: <Network className="w-5 h-5 text-brand-secondary" />,
      description: "Raw texts are parsed into multi-dimensional embeddings and linked in our global corporate knowledge graph. We map parent-subsidiary relations, competitor lines, and supply-chain flows.",
      technical: "Sub-50ms query responses on our custom 1536-dimensional semantic vector index database.",
    },
    {
      number: "03",
      title: "Predictive Forecasting Simulations",
      icon: <Cpu className="w-5 h-5 text-brand-accent" />,
      description: "Our intelligence engine runs hundreds of automated revenue, margin, and market volatility projections based on emerging micro-signals detected in filings.",
      technical: "Utilizes Monte Carlo simulation overlays against historical macro-indicators.",
    },
    {
      number: "04",
      title: "Boardroom-Ready Insight Distillation",
      icon: <FileCheck className="w-5 h-5 text-brand-primary" />,
      description: "Key findings are distilled into fully structured executive briefings, SWOT analysis panels, and presentation slides matching corporate style guidelines.",
      technical: "Uses guardrailed LLM agents to cross-validate claims, providing direct source citation links.",
    },
  ];

  return (
    <section id="process" className="relative py-28 bg-[#050816] overflow-hidden">
      
      {/* Background Glows */}
      <div className="absolute bottom-[10%] right-0 w-[40rem] h-[40rem] bg-brand-secondary/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-24">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/[0.08] bg-white/[0.02] mb-5">
            <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">
              The Forge Pipeline
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6">
            From raw data to{" "}
            <span className="text-gradient-rainbow">boardroom strategy</span>
          </h2>
          <p className="text-slate-400 text-base md:text-lg">
            How ForgeMind automatically processes unstructured public records into structured, high-fidelity corporate intelligence.
          </p>
        </div>

        {/* Vertical Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical central line (desktop) */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-brand-primary via-brand-secondary to-brand-accent opacity-20 transform -translate-x-1/2" />

          {/* Timeline Steps */}
          <div className="space-y-16 md:space-y-24">
            {steps.map((step, index) => {
              const isEven = index % 2 === 0;
              return (
                <div key={step.number} className="relative flex flex-col md:flex-row items-start md:items-center">
                  
                  {/* Timeline Node Point */}
                  <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 z-20 flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                      className="w-10 h-10 rounded-full bg-[#050816] border border-white/10 flex items-center justify-center shadow-lg shadow-black"
                    >
                      {step.icon}
                    </motion.div>
                  </div>

                  {/* Spacer / Content layout */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full pl-12 md:pl-0">
                    
                    {/* Content Box */}
                    <div className={`md:flex ${isEven ? "md:justify-end md:text-right" : "md:order-2"}`}>
                      <motion.div
                        initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6 }}
                        className="max-w-md glass-card rounded-2xl p-6 md:p-8 relative hover:border-white/20 transition-colors"
                      >
                        <span className="text-3xl font-extrabold text-white/5 absolute top-4 right-6 pointer-events-none select-none font-mono">
                          {step.number}
                        </span>

                        <h3 className="text-lg md:text-xl font-bold text-white mb-3">
                          {step.title}
                        </h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-4">
                          {step.description}
                        </p>
                        
                        {/* Technical Meta Pill */}
                        <div className={`inline-flex items-start text-[10px] text-slate-500 font-mono border-t border-white/[0.06] pt-3.5 mt-2 text-left ${
                          isEven ? "md:justify-end" : ""
                        }`}>
                          <span className="text-brand-accent font-semibold mr-1.5">[ENGINE_SPEC]</span>
                          <span>{step.technical}</span>
                        </div>
                      </motion.div>
                    </div>

                    {/* Empty side for layout on desktop */}
                    <div className={`hidden md:block ${isEven ? "md:order-2" : ""}`} />
                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
