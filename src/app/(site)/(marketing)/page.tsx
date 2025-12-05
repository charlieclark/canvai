"use client";

import { HeroSection } from "./_components/hero-section";
import { CTASection } from "./_components/cta-section";
import { cn } from "@/lib/utils";
import { redirect } from "next/navigation";

const sections = [
  {
    id: "hero",
    component: HeroSection,
  },
  {
    id: "cta",
    component: CTASection,
  },
];

export default function Home() {
  return (
    <main>
      {sections.map(({ id, component: Comp }, index) => (
        <div
          key={id}
          id={id}
          className={cn(index % 2 !== 0 ? "bg-muted/50" : "")}
        >
          <Comp />
        </div>
      ))}
    </main>
  );
}
