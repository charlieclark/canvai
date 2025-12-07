"use client";

import { Button } from "@/components/ui/button";
import useSignupModal from "@/hooks/use-signup";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function CTASection() {
  const { openSignupModal } = useSignupModal();

  return (
    <section className="relative overflow-hidden bg-[#F5F3EE] pt-16 pb-48">
      {/* Subtle decorative elements */}
      <div className="pointer-events-none absolute top-1/2 left-1/4 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-[#0066CC]/5 to-[#059669]/5 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 right-1/4 h-[400px] w-[400px] translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-[#F97316]/5 to-[#FBBF24]/5 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-screen-xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center"
        >
          <h2 className="max-w-2xl text-4xl font-bold tracking-tight text-balance text-slate-900 sm:text-5xl">
            Ready to bring your ideas to life?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-slate-600">
            Bring your own Replicate API key and start creating. You only pay
            for what you generate—no subscriptions, no hidden fees.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <Button
              size="lg"
              onClick={() => openSignupModal()}
              className="group h-14 rounded-full bg-slate-900 px-8 text-base font-medium text-white shadow-lg transition-all hover:bg-slate-800 hover:shadow-xl"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Bottom waves transition to dark footer */}
      <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-[200px]">
        <svg
          viewBox="0 0 1440 200"
          fill="none"
          preserveAspectRatio="none"
          className="h-full w-full"
        >
          <defs>
            <linearGradient id="ctaWave1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0066CC" />
              <stop offset="30%" stopColor="#0891B2" />
              <stop offset="60%" stopColor="#059669" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
            <linearGradient id="ctaWave2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F97316" />
              <stop offset="50%" stopColor="#FB923C" />
              <stop offset="100%" stopColor="#FBBF24" />
            </linearGradient>
            <linearGradient id="ctaWave3" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#EC4899" />
              <stop offset="100%" stopColor="#F472B6" />
            </linearGradient>
          </defs>

          {/* Back wave - blue/teal */}
          <path fill="url(#ctaWave1)" opacity="0.7">
            <animate
              attributeName="d"
              dur="8s"
              repeatCount="indefinite"
              values="
                M0 90 C120 60, 240 110, 360 80 C480 50, 600 100, 720 70 C840 40, 960 90, 1080 60 C1200 30, 1320 80, 1440 50 L1440 200 L0 200 Z;
                M0 70 C120 100, 240 60, 360 90 C480 120, 600 70, 720 100 C840 130, 960 80, 1080 110 C1200 140, 1320 90, 1440 70 L1440 200 L0 200 Z;
                M0 100 C120 70, 240 90, 360 60 C480 30, 600 80, 720 50 C840 20, 960 70, 1080 40 C1200 10, 1320 60, 1440 90 L1440 200 L0 200 Z;
                M0 90 C120 60, 240 110, 360 80 C480 50, 600 100, 720 70 C840 40, 960 90, 1080 60 C1200 30, 1320 80, 1440 50 L1440 200 L0 200 Z
              "
              calcMode="spline"
              keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1"
            />
          </path>

          {/* Middle wave - orange */}
          <path fill="url(#ctaWave2)" opacity="0.6">
            <animate
              attributeName="d"
              dur="6s"
              repeatCount="indefinite"
              values="
                M0 120 C120 100, 240 140, 360 120 C480 100, 600 130, 720 110 C840 90, 960 130, 1080 110 C1200 90, 1320 120, 1440 100 L1440 200 L0 200 Z;
                M0 110 C120 140, 240 110, 360 130 C480 150, 600 120, 720 140 C840 160, 960 130, 1080 150 C1200 170, 1320 140, 1440 120 L1440 200 L0 200 Z;
                M0 130 C120 110, 240 130, 360 110 C480 90, 600 120, 720 100 C840 80, 960 110, 1080 90 C1200 70, 1320 100, 1440 120 L1440 200 L0 200 Z;
                M0 120 C120 100, 240 140, 360 120 C480 100, 600 130, 720 110 C840 90, 960 130, 1080 110 C1200 90, 1320 120, 1440 100 L1440 200 L0 200 Z
              "
              calcMode="spline"
              keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1"
            />
          </path>

          {/* Accent wave - pink */}
          <path fill="url(#ctaWave3)" opacity="0.5">
            <animate
              attributeName="d"
              dur="5s"
              repeatCount="indefinite"
              values="
                M0 145 C120 130, 240 155, 360 140 C480 125, 600 150, 720 135 C840 120, 960 145, 1080 130 C1200 115, 1320 140, 1440 125 L1440 200 L0 200 Z;
                M0 135 C120 155, 240 135, 360 150 C480 165, 600 140, 720 155 C840 170, 960 145, 1080 160 C1200 175, 1320 150, 1440 140 L1440 200 L0 200 Z;
                M0 155 C120 140, 240 150, 360 135 C480 120, 600 145, 720 130 C840 115, 960 140, 1080 125 C1200 110, 1320 135, 1440 150 L1440 200 L0 200 Z;
                M0 145 C120 130, 240 155, 360 140 C480 125, 600 150, 720 135 C840 120, 960 145, 1080 130 C1200 115, 1320 140, 1440 125 L1440 200 L0 200 Z
              "
              calcMode="spline"
              keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1"
            />
          </path>

          {/* Front wave - dark blue (footer color) */}
          <path fill="#0f172b">
            <animate
              attributeName="d"
              dur="7s"
              repeatCount="indefinite"
              values="
                M0 165 C120 150, 240 175, 360 160 C480 145, 600 170, 720 155 C840 140, 960 165, 1080 150 C1200 135, 1320 160, 1440 145 L1440 200 L0 200 Z;
                M0 155 C120 175, 240 160, 360 175 C480 190, 600 165, 720 180 C840 195, 960 170, 1080 185 C1200 200, 1320 175, 1440 165 L1440 200 L0 200 Z;
                M0 175 C120 160, 240 170, 360 155 C480 140, 600 165, 720 150 C840 135, 960 160, 1080 145 C1200 130, 1320 155, 1440 170 L1440 200 L0 200 Z;
                M0 165 C120 150, 240 175, 360 160 C480 145, 600 170, 720 155 C840 140, 960 165, 1080 150 C1200 135, 1320 160, 1440 145 L1440 200 L0 200 Z
              "
              calcMode="spline"
              keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1"
            />
          </path>
        </svg>
      </div>
    </section>
  );
}
