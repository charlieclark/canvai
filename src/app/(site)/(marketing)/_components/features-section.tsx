"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Banana,
  Frame,
  KeyRound,
  LayoutGrid,
  Sparkles,
  Upload,
} from "lucide-react";
import { WaveTransition, darkToCreamWave } from "./wave-transition";

const features = [
  {
    title: "Infinite Canvas",
    description:
      "A boundless creative workspace built for experimentation. Pan, zoom, and arrange your ideas without limits.",
    icon: LayoutGrid,
    gradient: "from-cyan-400 to-blue-500",
    delay: 0,
  },
  {
    title: "Draw & Compose Frames",
    description:
      "Sketch rough ideas, add shapes, import images, and compose them into frames ready for AI transformation.",
    icon: Frame,
    gradient: "from-violet-400 to-purple-500",
    delay: 0.1,
  },
  {
    title: "Nano Banana Pro",
    description:
      "Convert your composed frames into polished images using our fine-tuned AI model. From sketch to stunning in seconds.",
    icon: Banana,
    gradient: "from-yellow-400 to-orange-500",
    delay: 0.2,
  },
  {
    title: "Generate Assets",
    description:
      "Create standalone elements—characters, objects, backgrounds—to use and reuse across your canvas compositions.",
    icon: Sparkles,
    gradient: "from-pink-400 to-rose-500",
    delay: 0.3,
  },
  {
    title: "Bring Your Own Key",
    description:
      "Use your own Replicate API key for unlimited generations. Full control over your AI usage and costs.",
    icon: KeyRound,
    gradient: "from-emerald-400 to-teal-500",
    delay: 0.4,
  },
  {
    title: "Export Anywhere",
    description:
      "Download your creations as high-resolution images. Ready for social media, print, or your next project.",
    icon: Upload,
    gradient: "from-amber-400 to-yellow-500",
    delay: 0.5,
  },
];

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="relative overflow-hidden bg-[#0f172b] pt-32 pb-48"
    >
      <div className="relative z-10 mx-auto max-w-screen-xl px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-20 text-center"
        >
          <span className="mb-4 inline-block rounded-full bg-white/5 px-4 py-1.5 text-sm font-medium text-cyan-400 ring-1 ring-white/10">
            Everything you need
          </span>
          <h2 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            From rough sketch to{" "}
            <span className="relative">
              <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
                polished art
              </span>
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 300 12"
                fill="none"
              >
                <path
                  d="M2 8C50 4, 100 10, 150 6C200 2, 250 8, 298 4"
                  stroke="url(#featuresUnderline)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="animate-draw"
                />
                <defs>
                  <linearGradient
                    id="featuresUnderline"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="50%" stopColor="#a78bfa" />
                    <stop offset="100%" stopColor="#f472b6" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            CanvAi combines the freedom of a digital canvas with the power
            of generative AI. No complex workflows—just draw, compose, and
            create.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>

      {/* Bottom waves transition to cream CTA */}
      <WaveTransition {...darkToCreamWave} />
    </section>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  delay: number;
}

function FeatureCard({
  title,
  description,
  icon: Icon,
  gradient,
  delay,
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
      className="group relative rounded-2xl border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent p-6 transition-[border-color] duration-300 hover:border-white/10"
    >
      {/* Hover glow effect */}
      <div
        className={cn(
          "pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-20",
          gradient,
        )}
      />

      <div className="relative">
        {/* Icon */}
        <div
          className={cn(
            "mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ring-1 ring-white/10",
            gradient,
          )}
        >
          <Icon className="h-6 w-6 text-white" />
        </div>

        {/* Content */}
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          {description}
        </p>
      </div>
    </motion.div>
  );
}

