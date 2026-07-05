"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Search, Filter, Sparkles, Plus, Compass, MapPin, ArrowRight, AlertCircle, RefreshCw } from "lucide-react";
import EmptyState from "@/components/dashboard/EmptyState";
import { Button } from "@/components/ui/button";
import { companyApi, Company } from "@/lib/api";

const CompanySkeleton = () => (
  <div className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.01] flex flex-col justify-between h-[180px] animate-pulse">
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="w-9 h-9 rounded-lg bg-slate-800" />
        <div className="w-16 h-4 bg-slate-800 rounded" />
      </div>
      <div className="h-4 w-32 bg-slate-800 rounded mb-2" />
      <div className="h-3 w-16 bg-slate-800/80 rounded mb-2" />
      <div className="h-3 w-28 bg-slate-800/60 rounded" />
    </div>
    <div className="border-t border-white/[0.04] pt-3 mt-4 flex items-center justify-between">
      <div className="h-3 w-20 bg-slate-800/60 rounded" />
      <div className="h-3 w-12 bg-slate-800/80 rounded" />
    </div>
  </div>
);

const ErrorState = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <div className="p-8 rounded-xl border border-red-500/20 bg-red-950/5 text-center space-y-4 max-w-md mx-auto relative overflow-hidden">
    <div className="absolute -top-12 -left-12 w-24 h-24 bg-red-500/5 rounded-full blur-2xl" />
    <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 mx-auto">
      <AlertCircle className="w-5 h-5 text-red-400 animate-pulse" />
    </div>
    <div className="space-y-1.5 relative">
      <h4 className="text-sm font-bold text-red-200">Intelligence Pipeline Offline</h4>
      <p className="text-xs text-slate-400 leading-relaxed">{message}</p>
    </div>
    <Button
      onClick={onRetry}
      size="sm"
      className="bg-red-950/20 hover:bg-red-900/30 border border-red-500/30 text-red-300 cursor-pointer text-xs"
    >
      <RefreshCw className="w-3.5 h-3.5 mr-1" />
      Retry Connection
    </Button>
  </div>
);

export default function CompaniesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCompanies = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await companyApi.getCompanies();
      setCompanies(data);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Failed to establish secure link to corporate indexes.";
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const filteredProfiles = companies.filter(
    (profile) =>
      profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const cleanSlug = (term: string) => {
    return term.trim().toLowerCase().replace(/\s+/g, "-");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 pb-12 text-white"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Companies <span className="bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">Intelligence</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Search, analyze, and track public profiles of corporate entities.
          </p>
        </div>
        
        {searchTerm ? (
          <Link href={`/company/${cleanSlug(searchTerm)}`}>
            <Button className="bg-brand-primary hover:bg-brand-primary/95 text-white font-medium text-xs h-9 px-4 cursor-pointer inline-flex items-center gap-1.5 shadow-lg shadow-brand-primary/20">
              <Plus className="w-3.5 h-3.5" />
              Scan &quot;{searchTerm}&quot;
            </Button>
          </Link>
        ) : (
          <Link href="/company/nvidia">
            <Button className="bg-brand-primary hover:bg-brand-primary/95 text-white font-medium text-xs h-9 px-4 cursor-pointer inline-flex items-center gap-1.5 shadow-lg shadow-brand-primary/20">
              <Plus className="w-3.5 h-3.5" />
              Scan New Company
            </Button>
          </Link>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Type company name, ticker or domain (e.g. Tesla, NVDA)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-white/[0.01] border border-white/[0.08] hover:border-white/20 focus:border-brand-primary rounded-lg outline-none text-slate-200 placeholder-slate-500 transition-colors"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/5 cursor-pointer h-9 px-3 text-xs inline-flex items-center gap-1.5"
          >
            <Filter className="w-3.5 h-3.5" />
            Filters
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/5 cursor-pointer h-9 px-3 text-xs inline-flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5" />
            Browse Sectors
          </Button>
        </div>
      </div>

      {/* Main Panel */}
      <div className="border border-white/[0.06] bg-white/[0.01] rounded-xl p-6 min-h-[450px] relative overflow-hidden flex flex-col justify-center">
        {/* Glow Effects */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-brand-accent/5 rounded-full blur-3xl -z-10" />
        
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full relative z-10"
            >
              {[1, 2, 3, 4].map((i) => (
                <CompanySkeleton key={i} />
              ))}
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative z-10 w-full"
            >
              <ErrorState message={error} onRetry={fetchCompanies} />
            </motion.div>
          ) : filteredProfiles.length > 0 ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full h-full relative z-10"
            >
              {filteredProfiles.map((profile) => {
                const initials = profile.name
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .substring(0, 2);

                const isIngested = profile.status === "Ingested";

                return (
                  <Link
                    key={profile.slug}
                    href={`/company/${profile.slug}`}
                    className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/[0.1] hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group cursor-pointer relative"
                  >
                    <div>
                      {/* Logo and Status Row */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-brand-primary to-brand-accent p-[1px] shadow-sm">
                          <div className="w-full h-full bg-[#050816] rounded-lg flex items-center justify-center font-bold text-xs text-white">
                            {initials}
                          </div>
                        </div>
                        <span className={`flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded border border-white/5 ${
                          isIngested ? "text-brand-accent" : "text-slate-500"
                        }`}>
                          {isIngested && <span className="w-1 h-1 rounded-full bg-brand-accent animate-ping" />}
                          {profile.status}
                        </span>
                      </div>

                      {/* Header */}
                      <h3 className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">
                        {profile.name}
                      </h3>
                      <span className="text-[10px] font-bold text-slate-400 bg-white/5 border border-white/10 px-1 rounded inline-block mt-0.5">
                        {profile.ticker}
                      </span>
                      <p className="text-[11px] text-slate-400 mt-2 font-medium">{profile.industry}</p>
                    </div>

                    <div className="border-t border-white/[0.04] pt-3 mt-4 flex items-center justify-between text-[10px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        {profile.headquarters}
                      </span>
                      <span className="text-brand-accent group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5 font-bold">
                        Workspace <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative z-10 w-full max-w-md mx-auto"
            >
              <EmptyState
                icon={Building2}
                title="Profile Not Found"
                description={`No analyzed company matching "${searchTerm}" was found in our indexes. Launch an AI scan to aggregate data for this firm.`}
                actionText={`Scan ${searchTerm}`}
                onActionClick={() => {
                  window.location.href = `/company/${cleanSlug(searchTerm)}`;
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Pro tip card */}
      <div className="p-4 rounded-xl border border-white/[0.06] bg-gradient-to-r from-white/[0.02] to-transparent flex gap-3.5">
        <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.08] flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4 text-brand-accent" />
        </div>
        <div>
          <h4 className="text-xs font-semibold text-slate-200">How to analyze a firm:</h4>
          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
            Enter a domain name or stock symbol. Our system will crawl earnings call transcripts, news feeds, regulatory filings, and social sentiment to deliver a unified intelligence profile in less than 3 minutes.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
