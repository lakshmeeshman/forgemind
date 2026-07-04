"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  LayoutDashboard,
  Building2,
  FileText,
  Layers,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export default function Sidebar({
  isCollapsed,
  setIsCollapsed,
  mobileOpen,
  setMobileOpen,
}: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Companies", href: "/companies", icon: Building2 },
    { name: "Reports", href: "/reports", icon: FileText },
    { name: "Workspace", href: "/workspace", icon: Layers },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const sidebarVariants = {
    expanded: { width: 240 },
    collapsed: { width: 72 },
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#050816] border-r border-white/[0.06] text-white">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-4 border-b border-white/[0.06]">
        <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden select-none">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-tr from-brand-primary to-brand-secondary p-[1px] shrink-0">
            <div className="w-full h-full bg-[#050816] rounded-lg flex items-center justify-center">
              <Brain className="w-4 h-4 text-brand-accent" />
            </div>
            <div className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-tr from-brand-primary to-brand-secondary opacity-40 blur-sm" />
          </div>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent"
            >
              Forge<span className="text-brand-accent">Mind</span>
            </motion.span>
          )}
        </Link>
      </div>

      {/* Workspace Selector (Simple/Premium) */}
      <div className="p-3">
        <div
          className={cn(
            "flex items-center gap-3 rounded-lg border border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.03] transition-colors duration-200 overflow-hidden",
            isCollapsed ? "justify-center p-2" : "p-3"
          )}
        >
          <div className="w-6 h-6 rounded-md bg-brand-primary/20 border border-brand-primary/30 flex items-center justify-center text-xs font-semibold text-brand-accent shrink-0 select-none">
            E
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-200 truncate leading-none mb-1">
                Enterprise Workspace
              </p>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">
                Premium
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link key={item.name} href={item.href}>
              <div
                className={cn(
                  "relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group cursor-pointer",
                  isActive
                    ? "text-brand-accent bg-white/[0.03] border border-white/[0.08]"
                    : "text-slate-400 hover:text-white hover:bg-white/[0.01] border border-transparent"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-md bg-gradient-to-b from-brand-primary to-brand-accent"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                
                <Icon
                  className={cn(
                    "w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-105",
                    isActive ? "text-brand-accent" : "text-slate-400 group-hover:text-slate-200"
                  )}
                />
                
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="truncate"
                  >
                    {item.name}
                  </motion.span>
                )}

                {/* Collapsed Tooltip */}
                {isCollapsed && (
                  <div className="absolute left-16 scale-0 group-hover:scale-100 transition-all duration-150 origin-left bg-[#090d22] border border-white/[0.08] text-xs text-white px-2 py-1.5 rounded-md shadow-xl whitespace-nowrap pointer-events-none z-50">
                    {item.name}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* AI Copilot Badge */}
      {!isCollapsed && (
        <div className="p-4 m-3 rounded-xl border border-white/[0.06] bg-gradient-to-b from-white/[0.02] to-transparent relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/10 rounded-full blur-xl group-hover:bg-brand-primary/15 transition-colors duration-300" />
          <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-accent mb-1.5 select-none">
            <Sparkles className="w-3.5 h-3.5" />
            AI Intelligence Active
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Ready to scan and synthesize public data.
          </p>
        </div>
      )}

      {/* Sidebar Collapse Toggle Button */}
      <div className="hidden md:flex p-3 border-t border-white/[0.06]">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center py-2.5 rounded-lg border border-white/[0.06] bg-white/[0.01] hover:bg-white/[0.04] text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        animate={isCollapsed ? "collapsed" : "expanded"}
        variants={sidebarVariants}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="hidden md:block h-screen sticky top-0 shrink-0 z-30 overflow-hidden"
      >
        <SidebarContent />
      </motion.aside>

      {/* Mobile Drawer Backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-y-0 left-0 w-[240px] z-50 md:hidden h-full shadow-2xl"
          >
            <SidebarContent />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
