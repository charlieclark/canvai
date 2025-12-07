"use client";

import { Button } from "@/components/ui/button";
import useSignupModal from "@/hooks/use-signup";
import { ArrowRight } from "lucide-react";
import { BrowserFrame } from "./browser-frame";
import VideoSection from "./video-section";
import { WaveTransition, creamToDarkWave } from "./wave-transition";

export function HeroSection() {
  const { openSignupModal } = useSignupModal();

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-[#F5F3EE]">
      {/* Bottom flowing waves with ondulating animation */}
      <WaveTransition {...creamToDarkWave} />

      {/* Left decorative element */}
      <div className="pointer-events-none absolute top-1/3 -left-32 h-64 w-64 rounded-full bg-gradient-to-br from-[#0066CC]/10 to-[#059669]/5 blur-3xl" />

      {/* Split view container */}
      <div className="relative z-10 mx-auto grid w-full max-w-screen-xl grid-cols-1 items-center gap-12 px-6 pt-24 pb-32 lg:grid-cols-2 lg:gap-16">
        {/* Left side - Content */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          {/* Main headline */}
          <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-balance text-slate-900 sm:text-6xl">
            Sketch it. Frame it. Prompt it.{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-[#0066CC] via-[#0891B2] to-[#059669] bg-clip-text text-transparent">
                Ship it.
              </span>
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 200 8"
                fill="none"
              >
                <path
                  d="M2 6C30 2, 70 2, 100 4C130 6, 170 6, 198 2"
                  stroke="url(#underlineGrad)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient
                    id="underlineGrad"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#0066CC" />
                    <stop offset="50%" stopColor="#0891B2" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-slate-600 md:text-xl">
            The infinite canvas where rough sketches become polished AI art.
            Compose your ideas, add a prompt, and generate stunning visuals—all
            in one creative workspace.
          </p>

          {/* CTA buttons */}
          <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row lg:items-start">
            <Button
              size="lg"
              onClick={() => openSignupModal()}
              className="group h-14 rounded-full bg-slate-900 px-8 text-base font-medium shadow-lg transition-all hover:bg-slate-800 hover:shadow-xl"
            >
              Start Creating Free
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            {/* <Button
              size="lg"
              variant="ghost"
              className="h-14 rounded-full px-8 text-base font-medium text-slate-700 hover:bg-white/80"
              onClick={() => {
                document
                  .getElementById("features")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              See How It Works
            </Button> */}
          </div>
        </div>

        {/* Right side - Browser Frame with Video */}
        <div className="flex items-center justify-center lg:justify-end">
          <BrowserFrame
            className="w-full max-w-2xl shadow-2xl"
            domainPreview="canvai.com/dashboard"
            variant="dark"
            size="small"
          >
            <VideoSection />
          </BrowserFrame>
        </div>
      </div>
    </section>
  );
}
