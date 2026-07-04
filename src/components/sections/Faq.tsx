"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "Where does ForgeMind obtain its public records data?",
      answer: "We continuously crawl and ingest official databases such as the SEC EDGAR registry, ESG ratings publications, global patent offices, state filing registries, and over 500 validated corporate news channels in real-time.",
    },
    {
      question: "How accurate is the automated SWOT synthesis?",
      answer: "Every single point inside our SWOT matrices is derived using a hybrid retrieval-augmented generation (RAG) framework. Every insight features direct inline citations, linking you directly to the original sentence in the raw SEC filing or report.",
    },
    {
      question: "Can we integrate our proprietary internal databases?",
      answer: "Yes. Our Enterprise plan supports hosting private vector-DB nodes inside your virtual private cloud (VPC). You can securely index internal documents, investment memos, and email flows without exposing them to public models.",
    },
    {
      question: "Is ForgeMind SOC2 compliant and secure?",
      answer: "ForgeMind is SOC2 Type II certified. All data is fully encrypted in transit (TLS 1.3) and at rest (AES-256). We maintain a zero-trust architecture and offer role-based access control (RBAC) with SAML SSO integration.",
    },
    {
      question: "Can we white-label the exported PDF reports?",
      answer: "Yes, you can upload corporate style presets (logos, font choices, primary color tokens), allowing your advisory or strategy teams to export client-ready PDF summaries and slide structures instantly.",
    },
  ];

  return (
    <section id="faq" className="relative py-28 bg-[#050816] overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-[20%] left-[10%] w-[35rem] h-[35rem] bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/[0.08] bg-white/[0.02] mb-5">
            <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">
              Common Inquiries
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-400 text-sm md:text-base">
            Everything you need to know about our data retrieval processes, security architectures, and enterprise custom integrations.
          </p>
        </div>

        {/* Accordion Wrapper */}
        <div className="glass-card rounded-2xl border border-white/[0.08] bg-[#050816]/50 p-6 md:p-8">
          <div className="space-y-1">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className="border-b border-white/[0.08] last:border-0 pb-1"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex justify-between items-center w-full text-left font-semibold py-5 text-white hover:text-brand-accent transition-colors duration-200 cursor-pointer focus:outline-none"
                  >
                    <span className="text-sm md:text-base pr-4">{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-brand-accent" : ""
                      }`}
                    />
                  </button>
                  
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <p className="text-slate-400 text-xs md:text-sm leading-relaxed pb-5 pt-1">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
