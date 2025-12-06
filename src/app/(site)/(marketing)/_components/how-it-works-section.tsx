"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const steps = [
  {
    number: "01",
    title: "Create a Frame",
    description:
      "Start by creating a frame on the infinite canvas. Choose from preset aspect ratios for social media, prints, or custom sizes.",
    color: "#0066CC",
    visual: (
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="absolute inset-4 rounded-xl border-2 border-dashed border-[#0066CC]/40 bg-white/80" />
        <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-[#0066CC]" />
          <span className="text-sm font-medium text-[#0066CC]">1:1 Frame</span>
        </div>
        {/* Decorative elements */}
        <div className="absolute bottom-6 right-6 h-16 w-16 rounded-lg bg-gradient-to-br from-[#0066CC]/20 to-[#0891B2]/20" />
        <div className="absolute left-6 top-6 h-12 w-12 rounded-full bg-gradient-to-br from-[#059669]/20 to-[#0066CC]/20" />
      </div>
    ),
  },
  {
    number: "02",
    title: "Design Your Vision",
    description:
      "Sketch, draw, or place reference images inside your frame. The canvas tools let you quickly layout your creative vision.",
    color: "#059669",
    visual: (
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="absolute inset-4 rounded-xl border border-slate-200 bg-white shadow-sm">
          {/* Sketch lines */}
          <svg
            className="absolute inset-0 h-full w-full p-4"
            viewBox="0 0 200 150"
          >
            <path
              d="M20 80 Q60 20 100 70 T180 60"
              stroke="#059669"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            <circle
              cx="40"
              cy="40"
              r="15"
              fill="#0066CC20"
              stroke="#0066CC"
              strokeWidth="1.5"
            />
            <rect
              x="140"
              y="90"
              width="40"
              height="40"
              rx="4"
              fill="#F9731620"
              stroke="#F97316"
              strokeWidth="1.5"
            />
            <path
              d="M80 100 L100 120 L120 90"
              stroke="#EC4899"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    ),
  },
  {
    number: "03",
    title: "Generate with AI",
    description:
      "Add a text prompt describing what you want. CanvAi uses your frame content as a reference to generate stunning, coherent visuals.",
    color: "#F97316",
    visual: (
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Prompt input */}
        <div className="absolute bottom-6 left-6 right-6 rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 animate-pulse rounded-full bg-[#F97316]" />
            <span className="text-sm text-slate-500">
              A serene mountain landscape at sunset...
            </span>
          </div>
        </div>
        {/* Generation effect */}
        <div className="absolute inset-0 flex items-center justify-center pb-12">
          <div className="relative">
            <div
              className="absolute inset-0 animate-ping rounded-full bg-[#F97316]/20"
              style={{ animationDuration: "2s" }}
            />
            <div
              className="absolute inset-2 animate-ping rounded-full bg-[#F97316]/30"
              style={{ animationDuration: "2s", animationDelay: "0.3s" }}
            />
            <div className="relative h-16 w-16 rounded-full bg-gradient-to-br from-[#F97316] to-[#FB923C] shadow-lg" />
          </div>
        </div>
      </div>
    ),
  },
  {
    number: "04",
    title: "Export & Share",
    description:
      "Download your creation in high resolution. Export individual frames or your entire canvas to share with the world.",
    color: "#EC4899",
    visual: (
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-gradient-to-br from-[#EC4899]/10 via-[#F97316]/10 to-[#0066CC]/10">
        {/* Generated image placeholder */}
        <div className="absolute inset-6 overflow-hidden rounded-xl bg-gradient-to-br from-[#0066CC] via-[#0891B2] to-[#059669] shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <span className="text-xs font-medium text-white/90">
              sunset_landscape.png
            </span>
            <div className="flex gap-2">
              <div className="h-6 w-6 rounded-full bg-white/20 backdrop-blur-sm" />
              <div className="h-6 w-6 rounded-full bg-white/20 backdrop-blur-sm" />
            </div>
          </div>
        </div>
      </div>
    ),
  },
];

export function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-[#F5F3EE] py-24 md:py-32"
    >
      {/* Background accent */}
      <div className="pointer-events-none absolute -left-48 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-gradient-to-br from-[#0066CC]/8 to-[#059669]/4 blur-3xl" />
      <div className="pointer-events-none absolute -right-48 top-1/3 h-96 w-96 rounded-full bg-gradient-to-br from-[#F97316]/8 to-[#EC4899]/4 blur-3xl" />

      <div className="relative mx-auto max-w-screen-xl px-6">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-[#059669]">
            How It Works
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
            From idea to image in{" "}
            <span className="bg-gradient-to-r from-[#059669] to-[#0891B2] bg-clip-text text-transparent">
              minutes
            </span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-slate-600">
            A simple, intuitive workflow that puts you in control of the
            creative process.
          </p>
        </div>

        {/* Steps */}
        <div className="mt-16 grid gap-12 md:mt-20 lg:grid-cols-2 lg:gap-16">
          {/* Left: Step list */}
          <div className="space-y-4">
            {steps.map((step, index) => (
              <button
                key={step.number}
                onClick={() => setActiveStep(index)}
                className={cn(
                  "group flex w-full items-start gap-6 rounded-2xl border p-6 text-left transition-all duration-300",
                  activeStep === index
                    ? "border-slate-200 bg-white shadow-lg"
                    : "border-transparent hover:bg-white/50"
                )}
              >
                {/* Number */}
                <div
                  className={cn(
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg font-bold transition-colors",
                    activeStep === index
                      ? "text-white"
                      : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                  )}
                  style={{
                    backgroundColor:
                      activeStep === index ? step.color : undefined,
                  }}
                >
                  {step.number}
                </div>

                {/* Content */}
                <div>
                  <h3
                    className={cn(
                      "text-lg font-semibold transition-colors",
                      activeStep === index ? "text-slate-900" : "text-slate-600"
                    )}
                  >
                    {step.title}
                  </h3>
                  <p
                    className={cn(
                      "mt-2 text-sm leading-relaxed transition-colors",
                      activeStep === index ? "text-slate-600" : "text-slate-400"
                    )}
                  >
                    {step.description}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Right: Visual */}
          <div className="relative lg:sticky lg:top-32 lg:self-start">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-xl">
              {steps[activeStep].visual}
            </div>
            {/* Decorative elements */}
            <div
              className="absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-3xl opacity-30 transition-colors duration-500"
              style={{ backgroundColor: `${steps[activeStep].color}20` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
