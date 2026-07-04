"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Building2, 
  BarChart3, 
  TrendingUp, 
  FileText, 
  MessageSquareCode, 
  Globe 
} from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  glowColor: string;
}

function FeatureCard({ title, description, icon, glowColor }: FeatureCardProps) {
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.015] backdrop-blur-md p-8 glass-card-hover group cursor-pointer transition-all duration-300"
    >
      {/* Radial Hover Glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100"
        style={{
          background: `radial-gradient(400px circle at ${coords.x}px ${coords.y}px, ${glowColor}, transparent 80%)`,
        }}
      />

      {/* Decorative Corner Highlight */}
      <div className="absolute top-0 right-0 w-[80px] h-[80px] bg-gradient-to-bl from-white/[0.04] to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div>
          {/* Icon Wrap */}
          <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center mb-6 group-hover:border-white/20 group-hover:bg-white/[0.06] transition-all duration-300">
            {icon}
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-brand-accent transition-colors duration-300">
            {title}
          </h3>

          {/* Description */}
          <p className="text-slate-400 text-sm leading-relaxed mb-6 group-hover:text-slate-300 transition-colors">
            {description}
          </p>
        </div>

        {/* Small learn more hover text */}
        <div className="text-xs font-semibold text-slate-500 group-hover:text-white transition-colors duration-300 flex items-center gap-1">
          Explore Module
          <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
        </div>
      </div>
    </div>
  );
}

export default function Features() {
  const featuresList = [
    {
      title: "AI Company Intelligence",
      description: "Instantly compile complete financial models, executive structures, historical earnings, and regulatory filings (SEC, ESG) into a single, cohesive view.",
      icon: <Building2 className="w-6 h-6 text-brand-primary" />,
      glowColor: "rgba(124, 58, 237, 0.12)",
    },
    {
      title: "Market Analytics",
      description: "Detect micro-trends, monitor raw consumer signals, sentiment deviations, and credit transaction volume in real-time across regional hubs.",
      icon: <BarChart3 className="w-6 h-6 text-brand-secondary" />,
      glowColor: "rgba(59, 130, 246, 0.12)",
    },
    {
      title: "Revenue Forecasting",
      description: "Run advanced vector-space simulations to forecast revenue pipelines, supply-chain bottlenecks, and margin drifts based on custom market models.",
      icon: <TrendingUp className="w-6 h-6 text-brand-accent" />,
      glowColor: "rgba(6, 182, 212, 0.12)",
    },
    {
      title: "Executive Reports",
      description: "Auto-generate presentation decks, board memos, and sector overview reports with custom charts, styled exactly to your corporate guidelines.",
      icon: <FileText className="w-6 h-6 text-brand-primary" />,
      glowColor: "rgba(124, 58, 237, 0.12)",
    },
    {
      title: "AI Copilot",
      description: "Integrate a contextual, natural language chatbot across your entire database, capable of answering complex analytical queries in sub-seconds.",
      icon: <MessageSquareCode className="w-6 h-6 text-brand-secondary" />,
      glowColor: "rgba(59, 130, 246, 0.12)",
    },
    {
      title: "Competitive Intelligence",
      description: "Track global competitor updates, patent registrations, pricing models, employee hiring sprees, and advertising metrics automatically.",
      icon: <Globe className="w-6 h-6 text-brand-accent" />,
      glowColor: "rgba(6, 182, 212, 0.12)",
    },
  ];

  return (
    <section id="features" className="relative py-28 bg-[#050816] overflow-hidden">
      
      {/* Background Accent Glows */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[60rem] h-[30rem] bg-brand-primary/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/[0.08] bg-white/[0.02] mb-5">
            <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">
              Core Capabilities
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6">
            The Intelligence Suite built for{" "}
            <span className="text-gradient-rainbow">high-velocity decisioning</span>
          </h2>
          <p className="text-slate-400 text-base md:text-lg leading-relaxed">
            Stop waiting for analyst teams. ForgeMind&apos;s modules provide real-time, validated corporate intelligence on-demand.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresList.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <FeatureCard {...feature} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
