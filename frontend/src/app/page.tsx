"use client";

import LandingNavbar from "@/components/landing/LandingNavbar";
import HeroSection from "@/components/landing/HeroSection";
import TechStackSection from "@/components/landing/TechStackSection";
import BlogSection from "@/components/landing/BlogSection";
import ProductSection from "@/components/landing/ProductSection";
import CreditsSection from "@/components/landing/CreditsSection";

export default function LandingPage() {
  return (
    <>
      <LandingNavbar />
      <HeroSection />
      <TechStackSection />
      <BlogSection />
      <ProductSection />
      <CreditsSection />
    </>
  );
}
