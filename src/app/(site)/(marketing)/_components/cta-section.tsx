"use client";

import { Button } from "@/components/ui/button";
import useSignupModal from "@/hooks/use-signup";
import { ArrowRight } from "lucide-react";

export function CtaSection() {
  const { openSignupModal } = useSignupModal();

  return (
    <section className="relative overflow-hidden bg-slate-900 py-24 md:py-32">
      {/* Organic background shapes */}
      <div className="pointer-events-none absolute inset-0">
        <svg
          viewBox="0 0 1440 500"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
          className="h-full w-full opacity-30"
        >
          <defs>
            <linearGradient id="ctaGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0066CC" />
              <stop offset="100%" stopColor="#0891B2" />
            </linearGradient>
            <linearGradient id="ctaGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#059669" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
            <linearGradient id="ctaGrad3" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F97316" />
              <stop offset="100%" stopColor="#FBBF24" />
            </linearGradient>
          </defs>
          {/* Flowing shapes */}
          <path
            d="M-100 400 C100 300, 300 450, 500 380 C700 310, 900 420, 1100 350 C1300 280, 1400 380, 1540 320 L1540 600 L-100 600 Z"
            fill="url(#ctaGrad1)"
          />
          <path
            d="M-100 450 C150 380, 350 480, 550 420 C750 360, 950 450, 1150 400 C1350 350, 1450 420, 1540 380 L1540 600 L-100 600 Z"
            fill="url(#ctaGrad2)"
            opacity="0.7"
          />
          <circle cx="200" cy="100" r="80" fill="url(#ctaGrad3)" opacity="0.4" />
          <circle cx="1200" cy="150" r="60" fill="#EC4899" opacity="0.3" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-screen-xl px-6 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
          Ready to{" "}
          <span className="bg-gradient-to-r from-[#0891B2] via-[#059669] to-[#10B981] bg-clip-text text-transparent">
            create
          </span>
          ?
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
          Join thousands of creators using CanvAi to bring their ideas to life.
          Start for free, no credit card required.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            size="lg"
            onClick={openSignupModal}
            className="group h-14 rounded-full bg-white px-8 text-base font-medium text-slate-900 shadow-lg transition-all hover:bg-slate-100 hover:shadow-xl"
          >
            Get Started Free
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        {/* Trust indicators */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 text-[#10B981]"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>Free to start</span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 text-[#10B981]"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>No credit card</span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 text-[#10B981]"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>Cancel anytime</span>
          </div>
        </div>
      </div>
    </section>
  );
}
