"use client";

import React from "react";
import { Brain, ArrowUpRight } from "lucide-react";

// Inline social SVGs to avoid dependency mismatches
const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#050816] border-t border-white/[0.08] pt-20 pb-12 overflow-hidden">
      
      {/* Background Accent Glow */}
      <div className="absolute bottom-0 left-[50%] -translate-x-1/2 w-[50rem] h-[25rem] bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
        
        {/* Brand Information Column */}
        <div className="md:col-span-4 flex flex-col items-start gap-4">
          <a href="#" className="flex items-center gap-2 group">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-primary to-brand-secondary p-[1px]">
              <div className="w-full h-full bg-[#050816] rounded-lg flex items-center justify-center">
                <Brain className="w-4 h-4 text-brand-accent group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
            <span className="font-bold text-lg tracking-tight text-white">
              Forge<span className="text-brand-accent">Mind</span>
            </span>
          </a>
          <p className="text-slate-400 text-xs md:text-sm leading-relaxed max-w-xs text-left">
            Translating unstructured public reports, filings, and global logistics data streams into validated, boardroom-ready corporate strategy models.
          </p>
        </div>

        {/* Links Column 1: Product */}
        <div className="md:col-span-2 flex flex-col items-start gap-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Product</h4>
          <a href="#features" className="text-xs text-slate-400 hover:text-white transition-colors">Core Features</a>
          <a href="#preview" className="text-xs text-slate-400 hover:text-white transition-colors">Dashboard Preview</a>
          <a href="#pricing" className="text-xs text-slate-400 hover:text-white transition-colors">Pricing Tiers</a>
          <a href="#" className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1">
            API Documentation <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>

        {/* Links Column 2: Resources */}
        <div className="md:col-span-2 flex flex-col items-start gap-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Resources</h4>
          <a href="#" className="text-xs text-slate-400 hover:text-white transition-colors">Filing Digests</a>
          <a href="#" className="text-xs text-slate-400 hover:text-white transition-colors">NLP Vector Docs</a>
          <a href="#" className="text-xs text-slate-400 hover:text-white transition-colors">Case Studies</a>
          <a href="#" className="text-xs text-slate-400 hover:text-white transition-colors">Help Center</a>
        </div>

        {/* Links Column 3: Company */}
        <div className="md:col-span-2 flex flex-col items-start gap-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Company</h4>
          <a href="#" className="text-xs text-slate-400 hover:text-white transition-colors">About Us</a>
          <a href="#" className="text-xs text-slate-400 hover:text-white transition-colors">Security Metrics</a>
          <a href="#" className="text-xs text-slate-400 hover:text-white transition-colors">Careers</a>
          <a href="mailto:contact@forgemind.ai" className="text-xs text-slate-400 hover:text-white transition-colors">Contact Strategy</a>
        </div>

        {/* Compliance Column */}
        <div className="md:col-span-2 flex flex-col items-start gap-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Compliance</h4>
          <span className="text-[10px] px-2.5 py-1 rounded bg-white/5 border border-white/10 text-slate-300 font-mono">
            SOC2 TYPE II
          </span>
          <span className="text-[10px] px-2.5 py-1 rounded bg-white/5 border border-white/10 text-slate-300 font-mono">
            ISO 27001
          </span>
        </div>

      </div>

      {/* Bottom Copyright & Social Links */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 border-t border-white/[0.06] pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left: Copyright */}
        <div className="text-xs text-slate-500 font-medium">
          © {currentYear} ForgeMind AI Inc. All rights reserved.
        </div>

        {/* Right: Social icons */}
        <div className="flex items-center gap-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
            aria-label="GitHub"
          >
            <GithubIcon className="w-4 h-4" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
            aria-label="Twitter"
          >
            <TwitterIcon className="w-4 h-4" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
            aria-label="LinkedIn"
          >
            <LinkedinIcon className="w-4 h-4" />
          </a>
        </div>

      </div>
    </footer>
  );
}
