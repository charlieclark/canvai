"use client";

import { HeroSection } from "./_components/hero-section";
import { FeaturesSection } from "./_components/features-section";
import { CTASection } from "./_components/cta-section";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <CTASection />
    </main>
  );
}
