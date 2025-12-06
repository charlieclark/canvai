"use client";

import { HeroSection } from "./_components/hero-section";
import { FeaturesSection } from "./_components/features-section";
import { HowItWorksSection } from "./_components/how-it-works-section";
import { CtaSection } from "./_components/cta-section";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <CtaSection />
    </main>
  );
}
