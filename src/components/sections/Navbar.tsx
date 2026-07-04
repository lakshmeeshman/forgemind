"use client";

import React, { useState, useEffect } from "react";
import { Brain, ArrowRight, Menu, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "Preview", href: "#preview" },
    { name: "Process", href: "#process" },
    { name: "Pricing", href: "#pricing" },
    { name: "FAQ", href: "#faq" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "py-3 bg-[#050816]/70 backdrop-blur-md border-b border-white/[0.08]"
          : "py-5 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-secondary p-[1px]">
            <div className="w-full h-full bg-[#050816] rounded-xl flex items-center justify-center">
              <Brain className="w-5 h-5 text-brand-accent group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-secondary opacity-50 blur-sm group-hover:opacity-75 transition-opacity" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white group-hover:text-white/90 transition-colors">
            Forge<span className="text-brand-accent">Mind</span>
          </span>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors duration-200"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="#pricing"
            className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
          >
            Sign In
          </a>
          <a
            href="#pricing"
            className="bg-brand-primary hover:bg-brand-primary/95 text-white border-0 cursor-pointer shadow-lg shadow-brand-primary/25 relative overflow-hidden group rounded-lg px-4 py-2 text-sm font-medium inline-flex items-center justify-center transition-all duration-300"
          >
            <span className="relative z-10 flex items-center gap-1.5 font-medium">
              Get Started
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-gradient-to-r from-brand-secondary to-brand-accent transition-transform duration-300 -z-0" />
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-1.5 rounded-lg border border-white/10 text-white cursor-pointer bg-white/5 hover:bg-white/10 transition-colors"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-[#050816] border-b border-white/[0.08] px-6 py-6 md:hidden flex flex-col gap-6 animate-in fade-in slide-in-from-top-5 duration-200">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-slate-400 hover:text-white transition-colors py-1"
              >
                {link.name}
              </a>
            ))}
          </nav>
          <div className="h-px bg-white/10" />
          <div className="flex flex-col gap-4">
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              Sign In
            </a>
            <a
              href="#pricing"
              className="w-full bg-brand-primary hover:bg-brand-primary/95 text-white font-medium text-center rounded-lg py-2.5 text-sm inline-flex items-center justify-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              Get Started
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
