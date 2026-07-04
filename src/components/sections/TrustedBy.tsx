"use client";

import React from "react";
import { motion } from "framer-motion";

export default function TrustedBy() {
  const partners = [
    {
      name: "Vercel",
      logo: (
        <svg viewBox="0 0 116 100" fill="currentColor" className="h-5 text-slate-500 hover:text-white transition-colors duration-300">
          <path d="M57.5 0L115 100H0L57.5 0Z" />
        </svg>
      ),
    },
    {
      name: "Stripe",
      logo: (
        <svg viewBox="0 0 80 34" fill="currentColor" className="h-5 text-slate-500 hover:text-white transition-colors duration-300">
          <path d="M41 18.2c0-3.6 2.9-5.1 7.2-5.1 3.5 0 7 .8 9.3 2.1l1.7-6.2c-2.3-1.1-6.1-1.9-9.9-1.9-11 0-17.7 5.9-17.7 15.6 0 10.8 7.4 14.3 16.5 14.3 4.3 0 7.9-.7 10.3-1.8l-1.5-6.1c-2.3 1.1-5.7 1.8-8.8 1.8-5 0-7.1-1.8-7.1-4.7m-20.9-4.8c0-2.3 1.8-3.6 4.7-3.6 2.3 0 4.6.6 6.1 1.4V4.7c-1.5-.7-4.1-1.2-6.6-1.2-7.3 0-11.8 3.9-11.8 10.3 0 7.2 4.9 9.5 11 9.5 2.9 0 5.3-.5 6.9-1.2l-1-4.1c-1.5.7-3.8 1.1-5.9 1.1-3.3 0-4.7-1.2-4.7-3.1" />
          <rect x="0" y="8" width="8" height="25" />
          <path d="M12 0h8v8h-8z" />
        </svg>
      ),
    },
    {
      name: "Linear",
      logo: (
        <svg viewBox="0 0 100 100" fill="currentColor" className="h-6 text-slate-500 hover:text-white transition-colors duration-300">
          <path d="M50 0C22.4 0 0 22.4 0 50s22.4 50 50 50 50-22.4 50-50S77.6 0 50 0zm0 85c-19.3 0-35-15.7-35-35s15.7-35 35-35 35 15.7 35 35-15.7 35-35 35z" />
          <path d="M50 25c-13.8 0-25 11.2-25 25h50c0-13.8-11.2-25-25-25z" />
        </svg>
      ),
    },
    {
      name: "Segment",
      logo: (
        <svg viewBox="0 0 120 30" fill="currentColor" className="h-5 text-slate-500 hover:text-white transition-colors duration-300">
          <path d="M15 0c8.3 0 15 6.7 15 15s-6.7 15-15 15S0 23.3 0 15 6.7 0 15 0zm0 8c-3.9 0-7 3.1-7 7s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7z M45 0c8.3 0 15 6.7 15 15s-6.7 15-15 15S30 23.3 30 15 36.7 0 45 0zm0 8c-3.9 0-7 3.1-7 7s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7z M75 0c8.3 0 15 6.7 15 15s-6.7 15-15 15S60 23.3 60 15 66.7 0 75 0zm0 8c-3.9 0-7 3.1-7 7s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7z" />
        </svg>
      ),
    },
    {
      name: "Acme",
      logo: (
        <svg viewBox="0 0 120 40" fill="currentColor" className="h-5 text-slate-500 hover:text-white transition-colors duration-300">
          <path d="M10 5L30 35H10L0 20L10 5Z M40 5L60 35H40L30 20L40 5Z M70 5L90 35H70L60 20L70 5Z" />
        </svg>
      ),
    },
    {
      name: "Notion",
      logo: (
        <svg viewBox="0 0 100 100" fill="currentColor" className="h-6 text-slate-500 hover:text-white transition-colors duration-300">
          <path d="M15 10v80h70V10H15zm8 8h54v56H23V18zm6 12v32h42V30H29z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="relative py-12 border-y border-white/[0.06] bg-[#050816]/40 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
        
        {/* Section Title */}
        <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-8 text-center">
          Trusted by high-growth startups and public enterprises alike
        </p>

        {/* Logo Carousel Container */}
        <div className="w-full relative overflow-hidden">
          {/* Fades on the side to give depth */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#050816] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#050816] to-transparent z-10 pointer-events-none" />

          {/* Scrolling Logos */}
          <motion.div
            className="flex items-center gap-16 md:gap-24 w-max py-2"
            animate={{
              x: [0, -1000],
            }}
            transition={{
              duration: 35,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {/* Render twice for continuous loop */}
            {[...partners, ...partners, ...partners].map((partner, index) => (
              <div
                key={`${partner.name}-${index}`}
                className="flex items-center justify-center opacity-65 hover:opacity-100 transition-opacity duration-300 w-32"
              >
                {partner.logo}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
