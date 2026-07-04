"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles, HelpCircle } from "lucide-react";

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");

  const plans = [
    {
      name: "Starter",
      description: "For small investment groups and boutique research firms.",
      price: billingCycle === "annual" ? "59" : "79",
      features: [
        "Monitor up to 5 company profiles",
        "Real-time news sentiment tracking",
        "Standard SEC vector search database",
        "Weekly automated SWOT synthesis",
        "Community forum & email support",
      ],
      buttonText: "Start Free Trial",
      highlighted: false,
    },
    {
      name: "Professional",
      description: "For high-velocity corporate strategy and consulting teams.",
      price: billingCycle === "annual" ? "199" : "249",
      features: [
        "Monitor up to 25 company profiles",
        "Real-time news + supply-chain sentiment",
        "Advanced Monte Carlo revenue forecasting",
        "Sub-second AI Copilot (Natural Language)",
        "Custom PDF report deck exporting",
        "Priority Slack channels support",
      ],
      buttonText: "Upgrade to Professional",
      highlighted: true,
    },
    {
      name: "Enterprise",
      description: "For global enterprises requiring full custom database alignment.",
      price: "Custom",
      features: [
        "Unlimited monitored company profiles",
        "Dedicated vector-DB nodes (private VPC)",
        "Custom fine-tuned LLM modeling options",
        "SOC2 Type II compliance dashboard integration",
        "Dedicated enterprise strategist support",
        "SLA guaranteed sub-100ms API endpoints",
      ],
      buttonText: "Contact Strategy Team",
      highlighted: false,
    },
  ];

  return (
    <section id="pricing" className="relative py-28 bg-[#050816] overflow-hidden">
      
      {/* Background Accent Glow */}
      <div className="absolute top-[30%] left-[50%] -translate-x-1/2 w-[70rem] h-[35rem] bg-brand-primary/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/[0.08] bg-white/[0.02] mb-5">
            <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">
              Pricing Options
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6">
            Transparent pricing for{" "}
            <span className="text-gradient-rainbow">high-scale analytics</span>
          </h2>
          <p className="text-slate-400 text-base md:text-lg">
            Choose the capacity that matches your corporate structure. Save 25% with annual commitments.
          </p>

          {/* Toggle Control */}
          <div className="mt-10 flex items-center justify-center gap-4">
            <span className={`text-sm font-semibold transition-colors duration-200 ${
              billingCycle === "monthly" ? "text-white" : "text-slate-500"
            }`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === "annual" ? "monthly" : "annual")}
              className="relative w-12 h-6.5 rounded-full bg-white/[0.08] border border-white/[0.1] p-0.5 cursor-pointer transition-all duration-300 focus:outline-none"
            >
              <motion.div
                layout
                className="w-5 h-5 rounded-full bg-brand-primary"
                animate={{
                  x: billingCycle === "annual" ? 22 : 0,
                }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
            <span className={`text-sm font-semibold transition-colors duration-200 flex items-center gap-1.5 ${
              billingCycle === "annual" ? "text-white" : "text-slate-500"
            }`}>
              Annual
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-accent/10 border border-brand-accent/20 text-brand-accent font-bold">
                Save 25%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative rounded-2xl border bg-white/[0.01] backdrop-blur-md p-8 md:p-10 flex flex-col justify-between transition-all duration-300 ${
                plan.highlighted
                  ? "border-brand-primary/50 shadow-xl shadow-brand-primary/10 glow-primary scale-102 z-20"
                  : "border-white/[0.08] hover:border-white/20 hover:bg-white/[0.02]"
              }`}
            >
              {/* Popular tag highlight */}
              {plan.highlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border border-brand-primary/30">
                  <Sparkles className="w-3 h-3 text-brand-accent animate-pulse" />
                  Most Popular Choice
                </div>
              )}

              <div>
                {/* Plan Name & Desc */}
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-slate-400 text-xs leading-relaxed mb-6 min-h-[40px]">{plan.description}</p>

                {/* Price Display */}
                <div className="flex items-baseline gap-1 mb-8">
                  {plan.price !== "Custom" && <span className="text-sm font-semibold text-slate-500 mr-0.5">$</span>}
                  <span className="text-4xl md:text-5xl font-black text-white tracking-tight">{plan.price}</span>
                  {plan.price !== "Custom" && (
                    <span className="text-xs text-slate-400 font-medium ml-1">/ user / month</span>
                  )}
                </div>

                <div className="h-px bg-white/[0.08] mb-8" />

                {/* Features list */}
                <ul className="space-y-4 mb-10 text-left">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-xs text-slate-300">
                      <Check className="w-4 h-4 text-brand-accent flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href={plan.price === "Custom" ? "mailto:sales@forgemind.ai" : "#pricing"}
                className={`w-full h-12 rounded-xl font-semibold cursor-pointer transition-all inline-flex items-center justify-center text-sm ${
                  plan.highlighted
                    ? "bg-brand-primary hover:bg-brand-primary/95 text-white shadow-lg shadow-brand-primary/20"
                    : "bg-white/5 hover:bg-white/10 border border-white/10 text-white"
                }`}
              >
                {plan.buttonText}
              </a>
            </motion.div>
          ))}
        </div>

        {/* Security / Enterprise SLA Callout footer */}
        <div className="mt-16 text-center text-xs text-slate-500 font-medium flex flex-col sm:flex-row items-center justify-center gap-3">
          <span>Need custom vector node deployments or localized regulatory compliance?</span>
          <a href="mailto:sales@forgemind.ai" className="text-brand-accent hover:underline flex items-center gap-1 font-semibold">
            Talk to strategy engineering <HelpCircle className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </section>
  );
}
