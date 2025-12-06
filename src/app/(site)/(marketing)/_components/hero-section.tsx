"use client";

import { Button } from "@/components/ui/button";
import useSignupModal from "@/hooks/use-signup";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  const { openSignupModal } = useSignupModal();

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F5F3EE]">
      {/* Bottom flowing waves with ondulating animation */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[400px]">
        <svg
          viewBox="0 0 1440 400"
          fill="none"
          preserveAspectRatio="none"
          className="h-full w-full"
        >
          <defs>
            <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0066CC" />
              <stop offset="30%" stopColor="#0891B2" />
              <stop offset="60%" stopColor="#059669" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
            <linearGradient id="wave2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F97316" />
              <stop offset="50%" stopColor="#FB923C" />
              <stop offset="100%" stopColor="#FBBF24" />
            </linearGradient>
            <linearGradient id="wave3" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#EC4899" />
              <stop offset="100%" stopColor="#F472B6" />
            </linearGradient>
          </defs>

          {/* Back wave - blue/green/teal - ondulating */}
          <path fill="url(#wave1)" opacity="0.85">
            <animate
              attributeName="d"
              dur="8s"
              repeatCount="indefinite"
              values="
                M0 180 C120 140, 240 200, 360 170 C480 140, 600 190, 720 160 C840 130, 960 180, 1080 150 C1200 120, 1320 170, 1440 140 L1440 400 L0 400 Z;
                M0 160 C120 200, 240 150, 360 180 C480 210, 600 160, 720 190 C840 220, 960 170, 1080 200 C1200 230, 1320 180, 1440 160 L1440 400 L0 400 Z;
                M0 190 C120 150, 240 190, 360 160 C480 130, 600 180, 720 150 C840 120, 960 170, 1080 140 C1200 110, 1320 160, 1440 180 L1440 400 L0 400 Z;
                M0 180 C120 140, 240 200, 360 170 C480 140, 600 190, 720 160 C840 130, 960 180, 1080 150 C1200 120, 1320 170, 1440 140 L1440 400 L0 400 Z
              "
              calcMode="spline"
              keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1"
            />
          </path>

          {/* Middle wave - orange - ondulating */}
          <path fill="url(#wave2)" opacity="0.75">
            <animate
              attributeName="d"
              dur="6s"
              repeatCount="indefinite"
              values="
                M0 240 C120 210, 240 260, 360 230 C480 200, 600 250, 720 220 C840 190, 960 240, 1080 210 C1200 180, 1320 230, 1440 200 L1440 400 L0 400 Z;
                M0 220 C120 260, 240 210, 360 240 C480 270, 600 220, 720 250 C840 280, 960 230, 1080 260 C1200 290, 1320 240, 1440 220 L1440 400 L0 400 Z;
                M0 250 C120 220, 240 250, 360 220 C480 190, 600 240, 720 210 C840 180, 960 230, 1080 200 C1200 170, 1320 220, 1440 240 L1440 400 L0 400 Z;
                M0 240 C120 210, 240 260, 360 230 C480 200, 600 250, 720 220 C840 190, 960 240, 1080 210 C1200 180, 1320 230, 1440 200 L1440 400 L0 400 Z
              "
              calcMode="spline"
              keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1"
            />
          </path>

          {/* Front wave - pink accent - ondulating */}
          <path fill="url(#wave3)" opacity="0.6">
            <animate
              attributeName="d"
              dur="5s"
              repeatCount="indefinite"
              values="
                M0 290 C120 270, 240 300, 360 280 C480 260, 600 290, 720 270 C840 250, 960 280, 1080 260 C1200 240, 1320 270, 1440 250 L1440 400 L0 400 Z;
                M0 270 C120 300, 240 270, 360 290 C480 310, 600 280, 720 300 C840 320, 960 290, 1080 310 C1200 330, 1320 300, 1440 280 L1440 400 L0 400 Z;
                M0 300 C120 280, 240 290, 360 270 C480 250, 600 280, 720 260 C840 240, 960 270, 1080 250 C1200 230, 1320 260, 1440 290 L1440 400 L0 400 Z;
                M0 290 C120 270, 240 300, 360 280 C480 260, 600 290, 720 270 C840 250, 960 280, 1080 260 C1200 240, 1320 270, 1440 250 L1440 400 L0 400 Z
              "
              calcMode="spline"
              keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1"
            />
          </path>

          {/* Bottom wave - white - transition to next section */}
          <path fill="#0f172b">
            <animate
              attributeName="d"
              dur="7s"
              repeatCount="indefinite"
              values="
                M0 340 C120 325, 240 350, 360 335 C480 320, 600 345, 720 330 C840 315, 960 340, 1080 325 C1200 310, 1320 335, 1440 320 L1440 400 L0 400 Z;
                M0 325 C120 345, 240 330, 360 345 C480 360, 600 335, 720 350 C840 365, 960 340, 1080 355 C1200 370, 1320 345, 1440 335 L1440 400 L0 400 Z;
                M0 350 C120 335, 240 345, 360 330 C480 315, 600 340, 720 325 C840 310, 960 335, 1080 320 C1200 305, 1320 330, 1440 345 L1440 400 L0 400 Z;
                M0 340 C120 325, 240 350, 360 335 C480 320, 600 345, 720 330 C840 315, 960 340, 1080 325 C1200 310, 1320 335, 1440 320 L1440 400 L0 400 Z
              "
              calcMode="spline"
              keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1"
            />
          </path>
        </svg>
      </div>

      {/* Left decorative element */}
      <div className="pointer-events-none absolute -left-32 top-1/3 h-64 w-64 rounded-full bg-gradient-to-br from-[#0066CC]/10 to-[#059669]/5 blur-3xl" />

      {/* Content - centered */}
      <div className="relative z-10 mx-auto flex max-w-screen-xl flex-col items-center px-6 pb-32 text-center">
        {/* Main headline */}
        <h1 className="max-w-4xl text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl md:text-7xl lg:text-8xl">
          Where creativity{" "}
          <span className="relative inline-block">
            <span className="bg-gradient-to-r from-[#0066CC] via-[#0891B2] to-[#059669] bg-clip-text text-transparent">
              flows
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
          Transform your creative vision into stunning visuals. Sketch, design,
          and let AI bring your ideas to life.
        </p>

        {/* CTA buttons */}
        <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row">
          <Button
            size="lg"
            onClick={() => openSignupModal()}
            className="group h-14 rounded-full bg-slate-900 px-8 text-base font-medium shadow-lg transition-all hover:bg-slate-800 hover:shadow-xl"
          >
            Start Creating Free
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button
            size="lg"
            variant="ghost"
            className="h-14 rounded-full px-8 text-base font-medium text-slate-700 hover:bg-white/80"
            onClick={() => {
              document
                .getElementById("how-it-works")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            See How It Works
          </Button>
        </div>
      </div>
    </section>
  );
}
