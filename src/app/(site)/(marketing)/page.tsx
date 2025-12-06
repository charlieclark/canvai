"use client";

import { HeroSection } from "./_components/hero-section";
import { cn } from "@/lib/utils";

const sections = [
  {
    id: "hero",
    component: HeroSection,
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
