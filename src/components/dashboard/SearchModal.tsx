"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, History, ArrowRight, Building2, FileText, Layers, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const companies = [
    { name: "NVIDIA Corporation", ticker: "NVDA", slug: "nvidia" },
    { name: "Tesla, Inc.", ticker: "TSLA", slug: "tesla" },
    { name: "Microsoft Corporation", ticker: "MSFT", slug: "microsoft" },
    { name: "Apple Inc.", ticker: "AAPL", slug: "apple" },
  ];

  const recentSearches = [
    { text: "NVIDIA SWOT analysis", type: "company" },
    { text: "Tesla competitor mapping", type: "competitors" },
    { text: "Apple fiscal 2026 reports", type: "report" },
  ];

  const quickNav = [
    { name: "Companies Intelligence", href: "/companies", icon: Building2 },
    { name: "Executive Reports", href: "/reports", icon: FileText },
    { name: "Active Workspace", href: "/workspace", icon: Layers },
  ];

  const filteredCompanies = query
    ? companies.filter(
        (c) =>
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.ticker.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim()) {
      e.preventDefault();
      const matched = companies.find(
        (c) =>
          c.name.toLowerCase() === query.trim().toLowerCase() ||
          c.ticker.toLowerCase() === query.trim().toLowerCase() ||
          c.slug === query.trim().toLowerCase()
      );
      const slug = matched ? matched.slug : query.trim().toLowerCase().replace(/\s+/g, "-");
      router.push(`/company/${slug}`);
      onClose();
    }
  };

  const handleRecentSearchClick = (text: string) => {
    let slug = "nvidia";
    const lower = text.toLowerCase();
    if (lower.includes("nvidia")) slug = "nvidia";
    else if (lower.includes("tesla")) slug = "tesla";
    else if (lower.includes("apple")) slug = "apple";
    else if (lower.includes("microsoft")) slug = "microsoft";
    else slug = lower.replace(/\s+/g, "-");

    router.push(`/company/${slug}`);
    onClose();
  };

  // Auto-focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Escape key listener to close
  useEffect(() => {
    const handleKeyDownEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDownEsc);
    }
    return () => window.removeEventListener("keydown", handleKeyDownEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-md"
        />

        {/* Command Palette Card */}
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="w-full max-w-2xl rounded-xl border border-white/[0.08] bg-[#090d22]/95 backdrop-blur-2xl shadow-2xl overflow-hidden text-white relative z-10"
        >
          {/* Input Header */}
          <div className="flex items-center px-4 py-3.5 border-b border-white/[0.06]">
            <Search className="w-4 h-4 text-slate-400 mr-3 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search companies, SWOT, intelligence profiles..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent border-0 outline-none text-slate-100 placeholder-slate-500 text-sm"
            />
            <button
              onClick={onClose}
              className="p-1 rounded-md border border-white/5 bg-white/5 text-slate-400 hover:text-white cursor-pointer transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Search Content */}
          <div className="p-4 space-y-5 max-h-[60vh] overflow-y-auto">
            {/* Suggested / Matching Profiles */}
            {query && (
              <div>
                <h4 className="text-[10px] font-bold tracking-wider text-brand-accent uppercase mb-2">
                  Matching Profiles
                </h4>
                {filteredCompanies.length > 0 ? (
                  <div className="space-y-1">
                    {filteredCompanies.map((c) => (
                      <button
                        key={c.slug}
                        onClick={() => {
                          router.push(`/company/${c.slug}`);
                          onClose();
                        }}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg border border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.04] text-slate-300 hover:text-white text-xs font-semibold text-left transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-2.5">
                          <Building2 className="w-4 h-4 text-brand-accent shrink-0" />
                          <span>{c.name}</span>
                          <span className="text-[9px] font-bold text-slate-400 bg-white/5 border border-white/10 px-1.5 py-0.5 rounded uppercase">
                            {c.ticker}
                          </span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 p-2 border border-white/[0.04] bg-white/[0.01] rounded-lg">
                    No matching profiles. Press <kbd className="border border-white/10 bg-white/5 px-1 rounded mx-0.5">Enter</kbd> to launch raw synthesis for <span className="text-slate-300 font-semibold">&quot;{query}&quot;</span>.
                  </div>
                )}
              </div>
            )}

            {/* Quick Navigation Links */}
            <div>
              <h4 className="text-[10px] font-bold tracking-wider text-slate-500 uppercase mb-2">
                Quick Navigation
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {quickNav.map((nav) => {
                  const Icon = nav.icon;
                  return (
                    <Link
                      key={nav.name}
                      href={nav.href}
                      onClick={onClose}
                      className="flex items-center gap-2.5 p-3 rounded-lg border border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.04] hover:border-white/[0.08] transition-all group"
                    >
                      <Icon className="w-4 h-4 text-brand-accent group-hover:scale-105 transition-transform" />
                      <span className="text-xs text-slate-300 font-medium group-hover:text-slate-100">
                        {nav.name}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Recent Searches */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                  Recent Intelligence Requests
                </h4>
                <History className="w-3.5 h-3.5 text-slate-500" />
              </div>
              <div className="space-y-1">
                {recentSearches.map((search) => (
                  <button
                    key={search.text}
                    onClick={() => handleRecentSearchClick(search.text)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/[0.03] text-slate-300 hover:text-white text-xs font-medium text-left transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <History className="w-3.5 h-3.5 text-slate-500" />
                      <span>{search.text}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}
              </div>
            </div>

            {/* Pro Tip Box */}
            <div className="p-3.5 rounded-lg border border-brand-primary/10 bg-brand-primary/5 flex gap-3">
              <Sparkles className="w-4 h-4 text-brand-accent shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-semibold text-brand-accent">ForgeMind AI Search:</span>{" "}
                <span className="text-slate-300">
                  Type a company name or ticker (e.g. &quot;AAPL&quot;) followed by an objective like &quot;SWOT&quot; or &quot;Risks&quot; for a fast-pass AI synthesis.
                </span>
              </div>
            </div>
          </div>

          {/* Footer Shortcuts */}
          <div className="px-4 py-2 bg-white/[0.02] border-t border-white/[0.06] flex items-center justify-between text-[10px] text-slate-500 font-medium">
            <div className="flex items-center gap-3">
              <span>
                <kbd className="border border-white/10 bg-white/5 px-1 rounded mr-1">↑↓</kbd> to navigate
              </span>
              <span>
                <kbd className="border border-white/10 bg-white/5 px-1 rounded mr-1">Enter</kbd> to select
              </span>
            </div>
            <span>
              <kbd className="border border-white/10 bg-white/5 px-1 rounded mr-1">ESC</kbd> to close
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
