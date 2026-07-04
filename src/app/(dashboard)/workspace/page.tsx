"use client";

import React from "react";
import { motion } from "framer-motion";
import { Layers, Sparkles, Users, Cpu, ShieldAlert, KeyRound } from "lucide-react";
import EmptyState from "@/components/dashboard/EmptyState";

export default function WorkspacePage() {
  const stats = [
    { label: "Active Pipelines", val: "0 Active", desc: "No pipelines currently crawling" },
    { label: "Organization Seat Allocation", val: "1 / 10 seats", desc: "Enterprise account limits" },
    { label: "Monthly AI Credits", val: "4,950 / 5,000 credits", desc: "Remaining balance" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 pb-12 text-white"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">
          Active <span className="bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">Workspace</span>
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Manage team workspaces, AI credits, and data extraction pipelines.
        </p>
      </div>

      {/* Grid displaying current usage metrics without fake graphs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.01] backdrop-blur-md"
          >
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              {stat.label}
            </span>
            <p className="text-xl font-bold text-slate-200">{stat.val}</p>
            <p className="text-[10px] text-slate-400 mt-2">{stat.desc}</p>
          </div>
        ))}
      </div>

      {/* Layout Grid: Details & Empty States */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Empty State for extraction jobs */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.01] p-6 space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-white/[0.06]">
              <Cpu className="w-4 h-4 text-brand-accent" />
              <h3 className="text-sm font-semibold text-slate-200">Intelligence Extraction Jobs</h3>
            </div>
            
            <EmptyState
              icon={Layers}
              title="No active scraping pipelines"
              description="Deploy a custom web data scraper targeting specific regulatory databases or company news blogs."
              actionText="Deploy New Pipeline"
              onActionClick={() => {
                alert("Pipeline setup will be implemented in future development sprint.");
              }}
            />
          </div>
        </div>

        {/* Right Side: Security & Collaborator Info */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Active Seats Card */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.01] p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-brand-accent" />
              <h3 className="text-sm font-semibold text-slate-200">Active Collaborators</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02]">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-brand-primary/20 border border-brand-primary/30 flex items-center justify-center text-[10px] font-semibold text-brand-accent">
                    AM
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-200 block">Alex Mercer</span>
                    <span className="text-[9px] text-slate-400">alex.mercer@forgemind.ai</span>
                  </div>
                </div>
                <span className="text-[9px] font-bold text-brand-accent uppercase tracking-wider bg-brand-primary/10 px-1.5 py-0.5 rounded">
                  Admin
                </span>
              </div>
            </div>
          </div>

          {/* Encryption & Credentials */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.01] p-6 space-y-4">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-brand-accent" />
              <h3 className="text-sm font-semibold text-slate-200">Security Credentials</h3>
            </div>
            
            <div className="flex items-start gap-2.5 text-slate-400">
              <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed">
                Workspace is protected with AES-256 endpoint encryption. Private API credentials for extraction crawlers must be configured inside Settings.
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Footer Pro Tip */}
      <div className="p-4 rounded-xl border border-white/[0.06] bg-gradient-to-r from-white/[0.02] to-transparent flex gap-3.5">
        <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.08] flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4 text-brand-accent" />
        </div>
        <div>
          <h4 className="text-xs font-semibold text-slate-200">Multi-Workspace Integration:</h4>
          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
            You can link this workspace to Slack, Microsoft Teams, or custom webhook endpoints to broadcast intelligence alerts automatically whenever a target company triggers a business sentiment change.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
