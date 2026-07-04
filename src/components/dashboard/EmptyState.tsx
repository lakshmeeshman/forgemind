"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onActionClick?: () => void;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionText,
  onActionClick,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col items-center justify-center text-center p-8 rounded-xl border border-white/[0.06] bg-white/[0.01] backdrop-blur-md max-w-md mx-auto"
    >
      <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-white/[0.02] border border-white/[0.08] mb-4">
        <Icon className="w-6 h-6 text-brand-accent/80" />
        <div className="absolute inset-0 -z-10 rounded-xl bg-brand-accent/5 blur-sm" />
      </div>
      
      <h3 className="text-base font-semibold text-slate-200 mb-1">{title}</h3>
      <p className="text-sm text-slate-400 mb-5 leading-relaxed">{description}</p>
      
      {actionText && onActionClick && (
        <Button
          variant="outline"
          size="sm"
          onClick={onActionClick}
          className="border-white/10 text-slate-300 hover:text-white hover:bg-white/5 cursor-pointer font-medium"
        >
          {actionText}
        </Button>
      )}
    </motion.div>
  );
}
