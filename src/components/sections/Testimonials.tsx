"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Jenkins",
      role: "Head of Corporate Strategy",
      company: "Acme Corp",
      avatarBg: "from-brand-primary to-brand-secondary",
      initials: "SJ",
      quote: "ForgeMind completely transformed our market intelligence cycle. What used to take our analysts three days of manual SEC and news review now populates in a validated executive briefing in seconds.",
    },
    {
      name: "Marcus Vance",
      role: "Managing Director",
      company: "Capital Signal",
      avatarBg: "from-brand-secondary to-brand-accent",
      initials: "MV",
      quote: "The predictive SWOT analysis tool has been exceptionally accurate. It flagged APAC logistic deviations weeks before they became mainstream news headlines, giving us a massive market advantage.",
    },
    {
      name: "Elena Rostova",
      role: "VP of Product Analytics",
      company: "Vercel Inc",
      avatarBg: "from-brand-accent to-brand-primary",
      initials: "ER",
      quote: "We integrated ForgeMind's API into our internal roadmap tools. The natural language copilot is incredibly responsive, allowing non-technical leaders to query raw market sentiment in sub-seconds.",
    },
  ];

  return (
    <section className="relative py-28 bg-[#050816] overflow-hidden">
      
      {/* Background Accent Glow */}
      <div className="absolute top-[10%] left-[20%] w-[35rem] h-[35rem] bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/[0.08] bg-white/[0.02] mb-5">
            <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">
              Client Validation
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6">
            Approved by leading{" "}
            <span className="text-gradient-rainbow">industry minds</span>
          </h2>
          <p className="text-slate-400 text-base md:text-lg">
            Hear from corporate strategy leaders and managing directors who rely on ForgeMind for day-to-day operations.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative rounded-2xl border border-white/[0.08] bg-white/[0.01] backdrop-blur-md p-8 flex flex-col justify-between hover:border-white/20 transition-all duration-300 group"
            >
              {/* Quote Icon Overlay */}
              <Quote className="absolute right-6 top-6 w-10 h-10 text-white/[0.02] pointer-events-none group-hover:text-white/[0.04] transition-colors" />

              <div>
                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-brand-accent fill-brand-accent" />
                  ))}
                </div>

                {/* Quote Text */}
                <p className="text-slate-300 text-sm leading-relaxed mb-8 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              {/* Reviewer Details */}
              <div className="flex items-center gap-4 border-t border-white/[0.06] pt-6">
                
                {/* Styled Profile Avatar */}
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${t.avatarBg} p-[1px] flex-shrink-0`}>
                  <div className="w-full h-full bg-[#050816] rounded-xl flex items-center justify-center">
                    <span className="text-xs font-bold text-white font-mono">{t.initials}</span>
                  </div>
                </div>

                <div className="text-left">
                  <div className="text-sm font-semibold text-white">{t.name}</div>
                  <div className="text-[11px] text-slate-400">
                    {t.role} at <span className="text-brand-accent">{t.company}</span>
                  </div>
                </div>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
