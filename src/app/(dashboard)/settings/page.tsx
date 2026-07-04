"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  KeyRound,
  Bell,
  CreditCard,
  Eye,
  EyeOff,
  Check,
  Shield,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [showApiKey, setShowApiKey] = useState(false);
  const [copied, setCopied] = useState(false);

  const tabs = [
    { id: "profile", name: "User Profile", icon: User },
    { id: "keys", name: "API Access Keys", icon: KeyRound },
    { id: "notifications", name: "Alerts & Notifications", icon: Bell },
    { id: "billing", name: "Subscription & Billing", icon: CreditCard },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText("fm_live_7c3aed3b82f606b6d4050816");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
          System <span className="bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">Settings</span>
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Configure profile settings, secure API credentials, and notifications.
        </p>
      </div>

      {/* Main Settings Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Sidebar Navigation */}
        <div className="lg:col-span-3 space-y-1.5 bg-white/[0.01] border border-white/[0.06] p-2 rounded-xl">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-left transition-colors cursor-pointer select-none",
                  isSelected
                    ? "bg-white/[0.04] border border-white/[0.08] text-brand-accent"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.01]"
                )}
              >
                <Icon className={cn("w-4 h-4", isSelected ? "text-brand-accent" : "text-slate-400")} />
                {tab.name}
              </button>
            );
          })}
        </div>

        {/* Right Side: Tab Panel Container */}
        <div className="lg:col-span-9 rounded-xl border border-white/[0.06] bg-white/[0.01] p-6 min-h-[400px]">
          <AnimatePresence mode="wait">
            
            {/* Tab: Profile */}
            {activeTab === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-sm font-semibold text-slate-200">Account Details</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Manage your personal profile and role configuration.
                  </p>
                </div>

                <div className="h-px bg-white/[0.06]" />

                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      defaultValue="Alex Mercer"
                      className="w-full px-3 py-1.5 text-xs bg-white/[0.01] border border-white/[0.08] focus:border-brand-primary rounded-lg outline-none text-slate-200"
                    />
                  </div>
                  
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                      Work Email
                    </label>
                    <input
                      type="email"
                      defaultValue="alex.mercer@forgemind.ai"
                      disabled
                      className="w-full px-3 py-1.5 text-xs bg-white/[0.01] border border-white/[0.04] rounded-lg outline-none text-slate-500 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                      Assigned System Role
                    </label>
                    <div className="flex items-center gap-2 p-3 rounded-lg border border-white/[0.04] bg-white/[0.01] w-fit">
                      <Shield className="w-4 h-4 text-brand-accent" />
                      <span className="text-xs font-semibold text-slate-300">Enterprise Principal Analyst</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Tab: Keys */}
            {activeTab === "keys" && (
              <motion.div
                key="keys"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-sm font-semibold text-slate-200">Integration Credentials</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    API keys for integrating ForgeMind data feeds into custom applications.
                  </p>
                </div>

                <div className="h-px bg-white/[0.06]" />

                <div className="space-y-4 max-w-lg">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                      API Access Key (Live Profile)
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 flex items-center justify-between px-3 py-2 rounded-lg border border-white/[0.08] bg-white/[0.01] font-mono text-xs text-slate-300 select-none overflow-hidden">
                        <span>{showApiKey ? "fm_live_7c3aed3b82f606b6d4050816" : "••••••••••••••••••••••••••••"}</span>
                        <button
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="p-1 text-slate-500 hover:text-slate-300 cursor-pointer transition-colors"
                        >
                          {showApiKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopy}
                        className="border-white/10 text-slate-300 hover:text-white cursor-pointer h-9 px-3 text-xs inline-flex items-center gap-1.5 shrink-0"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : "Copy"}
                      </Button>
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-1.5">
                      Never expose this key in client-side client applications. Keep it secure in backend variables.
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Tab: Notifications */}
            {activeTab === "notifications" && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-sm font-semibold text-slate-200">Alert Configuration</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Manage email and webhook triggers for active intelligence updates.
                  </p>
                </div>

                <div className="h-px bg-white/[0.06]" />

                <div className="space-y-4 max-w-md">
                  {[
                    { label: "Daily SWOT Briefing", desc: "Receive summary of major changes across tracked firms" },
                    { label: "Extreme Risk Webhook Hooks", desc: "Trigger endpoint execution on market risk spikes" },
                    { label: "Billing & Account Updates", desc: "Receipts, limit warnings and compliance alerts" },
                  ].map((notif) => (
                    <div
                      key={notif.label}
                      className="flex items-center justify-between p-3.5 rounded-lg border border-white/[0.04] bg-white/[0.01]"
                    >
                      <div className="mr-4">
                        <span className="text-xs font-semibold text-slate-200 block">{notif.label}</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">{notif.desc}</span>
                      </div>
                      <div className="relative w-8 h-4 bg-white/10 rounded-full cursor-pointer hover:bg-white/20 transition-colors">
                        <div className="absolute top-0.5 left-0.5 w-3 h-3 bg-brand-accent rounded-full translate-x-4 transition-transform duration-200" />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Tab: Billing */}
            {activeTab === "billing" && (
              <motion.div
                key="billing"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-sm font-semibold text-slate-200">Organization Plan</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Subscription management, payment history and credit allowances.
                  </p>
                </div>

                <div className="h-px bg-white/[0.06]" />

                <div className="p-4 rounded-xl border border-brand-primary/20 bg-brand-primary/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[9px] font-bold text-brand-accent uppercase tracking-wider bg-brand-primary/15 border border-brand-primary/20 px-2 py-0.5 rounded w-fit block mb-1 select-none">
                      Active
                    </span>
                    <h4 className="text-xs font-semibold text-slate-200">ForgeMind Enterprise Pro Tier</h4>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Full pipeline access, vector reports, and cited public scans.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white/10 text-slate-300 hover:text-white cursor-pointer h-9 px-3 text-xs"
                  >
                    Manage Subscription
                  </Button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>

      {/* Footer Pro Tip */}
      <div className="p-4 rounded-xl border border-white/[0.06] bg-gradient-to-r from-white/[0.02] to-transparent flex gap-3.5">
        <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.08] flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4 text-brand-accent" />
        </div>
        <div>
          <h4 className="text-xs font-semibold text-slate-200">Audit Logs & Access:</h4>
          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
            Every analytical request, export, and credentials modification is cataloged inside our audit records to maintain security and compliance under SOC 2 guidelines.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
