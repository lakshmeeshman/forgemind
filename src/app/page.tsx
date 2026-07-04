import React from "react";
import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import TrustedBy from "@/components/sections/TrustedBy";
import Features from "@/components/sections/Features";
import ProductPreview from "@/components/sections/ProductPreview";
import WhyForgeMind from "@/components/sections/WhyForgeMind";
import Testimonials from "@/components/sections/Testimonials";
import Pricing from "@/components/sections/Pricing";
import Faq from "@/components/sections/Faq";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#050816] text-white selection:bg-[#7C3AED]/30 selection:text-white antialiased">
      {/* Premium Floating Header */}
      <Navbar />

      {/* Main Sections */}
      <main className="flex flex-col">
        <Hero />
        <TrustedBy />
        <Features />
        <ProductPreview />
        <WhyForgeMind />
        <Testimonials />
        <Pricing />
        <Faq />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

