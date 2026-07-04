"use client";

import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Settings, CreditCard, LogOut, Shield } from "lucide-react";
interface UserDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserDropdown({ isOpen, onClose }: UserDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const menuItems = [
    { label: "My Profile", icon: User, href: "/settings?tab=profile" },
    { label: "Workspace Settings", icon: Settings, href: "/settings?tab=workspace" },
    { label: "Billing & Plans", icon: CreditCard, href: "/settings?tab=billing" },
  ];

  return (
    <motion.div
      ref={dropdownRef}
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 10 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-white/[0.08] bg-[#090d22]/95 backdrop-blur-xl shadow-2xl p-2 z-50 origin-top-right text-white"
    >
      {/* User Info Header */}
      <div className="px-3 py-2.5 mb-1.5 border-b border-white/[0.06] select-none">
        <p className="text-sm font-semibold text-slate-200 leading-tight">Alex Mercer</p>
        <p className="text-[11px] text-slate-400 mt-0.5 truncate">alex.mercer@forgemind.ai</p>
        <div className="flex items-center gap-1 mt-2 text-[10px] font-semibold text-brand-accent uppercase tracking-wider bg-brand-primary/10 border border-brand-primary/20 w-fit px-1.5 py-0.5 rounded">
          <Shield className="w-2.5 h-2.5" />
          Admin
        </div>
      </div>

      {/* Menu Options */}
      <div className="space-y-0.5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              onClick={() => {
                onClose();
                // Simple routing or visual update
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.04] transition-colors duration-150 text-left text-xs font-medium cursor-pointer"
            >
              <Icon className="w-4 h-4 text-slate-400" />
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="h-px bg-white/[0.06] my-1.5" />

      {/* Sign Out Option */}
      <button
        onClick={() => {
          onClose();
          // Mock Sign Out redirect
          window.location.href = "/";
        }}
        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors duration-150 text-left text-xs font-medium cursor-pointer"
      >
        <LogOut className="w-4 h-4" />
        Sign Out
      </button>
    </motion.div>
  );
}
