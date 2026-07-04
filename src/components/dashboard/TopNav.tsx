"use client";

import React, { useState } from "react";
import { Menu, Search, Bell } from "lucide-react";
import { usePathname } from "next/navigation";
import UserDropdown from "./UserDropdown";
import { AnimatePresence } from "framer-motion";

interface TopNavProps {
  onSearchTrigger: () => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export default function TopNav({
  onSearchTrigger,
  mobileOpen,
  setMobileOpen,
}: TopNavProps) {
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifCount, setNotifCount] = useState(3);

  // Capitalize path for breadcrumb
  const getPageTitle = () => {
    if (!pathname) return "Dashboard";
    const path = pathname.split("/").filter(Boolean)[0];
    if (!path) return "Dashboard";
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <header className="sticky top-0 z-40 w-full h-16 border-b border-white/[0.06] bg-[#050816]/75 backdrop-blur-md flex items-center px-4 md:px-6 justify-between select-none">
      
      {/* Mobile Menu & Page Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1.5 rounded-lg border border-white/10 text-white cursor-pointer bg-white/5 hover:bg-white/10 transition-colors md:hidden shrink-0"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-slate-400">
          <span className="hidden sm:inline">FORGEMIND</span>
          <span className="hidden sm:inline text-slate-600">/</span>
          <span className="text-slate-200 uppercase">{getPageTitle()}</span>
        </div>
      </div>

      {/* Interactive Search Bar Trigger (Cmd+K design) */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <button
          onClick={onSearchTrigger}
          className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] text-slate-400 hover:text-slate-300 transition-all duration-200 text-left text-xs cursor-pointer select-none"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <span>Search company intelligence...</span>
          </div>
          <kbd className="hidden lg:inline-flex h-5 select-none items-center gap-0.5 rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[10px] font-medium text-slate-400">
            <span>⌘</span>K
          </kbd>
        </button>
      </div>

      {/* Right Action Icons & Avatar */}
      <div className="flex items-center gap-3">
        {/* Mobile Search Button */}
        <button
          onClick={onSearchTrigger}
          className="p-2 rounded-lg border border-white/[0.06] hover:bg-white/[0.04] text-slate-400 hover:text-white transition-colors md:hidden cursor-pointer"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Notifications Button */}
        <button
          onClick={() => setNotifCount(0)}
          className="p-2 rounded-lg border border-white/[0.06] hover:bg-white/[0.04] text-slate-400 hover:text-white transition-all duration-200 relative cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          {notifCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
          )}
        </button>

        {/* Vertical divider */}
        <div className="w-px h-6 bg-white/[0.08]" />

        {/* Avatar Trigger with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center justify-center w-8 h-8 rounded-full border border-white/[0.08] bg-gradient-to-tr from-brand-primary/40 to-brand-secondary/40 text-slate-200 hover:text-white transition-colors font-semibold text-xs relative cursor-pointer select-none"
          >
            AM
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-green-500 border border-[#050816]" />
          </button>
          
          <AnimatePresence>
            {dropdownOpen && (
              <UserDropdown isOpen={dropdownOpen} onClose={() => setDropdownOpen(false)} />
            )}
          </AnimatePresence>
        </div>
      </div>

    </header>
  );
}
