"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const features = [
  {
    title: "Infinite Canvas",
    description:
      "A boundless creative workspace built for experimentation. Pan, zoom, and arrange your ideas without limits.",
    icon: CanvasIcon,
    gradient: "from-cyan-400 to-blue-500",
    delay: 0,
  },
  {
    title: "Draw & Compose Frames",
    description:
      "Sketch rough ideas, add shapes, import images, and compose them into frames ready for AI transformation.",
    icon: FrameIcon,
    gradient: "from-violet-400 to-purple-500",
    delay: 0.1,
  },
  {
    title: "Nano Banana Pro",
    description:
      "Convert your composed frames into polished images using our fine-tuned AI model. From sketch to stunning in seconds.",
    icon: BananaIcon,
    gradient: "from-yellow-400 to-orange-500",
    delay: 0.2,
  },
  {
    title: "Generate Assets",
    description:
      "Create standalone elements—characters, objects, backgrounds—to use and reuse across your canvas compositions.",
    icon: SparklesIcon,
    gradient: "from-pink-400 to-rose-500",
    delay: 0.3,
  },
  {
    title: "Bring Your Own Key",
    description:
      "Use your own Replicate API key for unlimited generations. Full control over your AI usage and costs.",
    icon: KeyIcon,
    gradient: "from-emerald-400 to-teal-500",
    delay: 0.4,
  },
  {
    title: "Export Anywhere",
    description:
      "Download your creations as high-resolution images. Ready for social media, print, or your next project.",
    icon: ExportIcon,
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
      {/* Subtle grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Radial glow effects */}
      <div className="pointer-events-none absolute top-0 left-1/4 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-br from-cyan-500/10 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute right-0 bottom-0 h-[500px] w-[500px] translate-x-1/4 rounded-full bg-gradient-to-tl from-purple-500/10 to-transparent blur-3xl" />

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
            Nano Canvas combines the freedom of a digital canvas with the power
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
      <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-[200px]">
        <svg
          viewBox="0 0 1440 200"
          fill="none"
          preserveAspectRatio="none"
          className="h-full w-full"
        >
          <defs>
            <linearGradient id="featureWave1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0891B2" />
              <stop offset="50%" stopColor="#059669" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
            <linearGradient id="featureWave2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F97316" />
              <stop offset="50%" stopColor="#FB923C" />
              <stop offset="100%" stopColor="#FBBF24" />
            </linearGradient>
          </defs>

          {/* Front wave - cream (target color) */}
          <path fill="#F5F3EE">
            <animate
              attributeName="d"
              dur="7s"
              repeatCount="indefinite"
              values="
                M0 160 C120 145, 240 170, 360 155 C480 140, 600 165, 720 150 C840 135, 960 160, 1080 145 C1200 130, 1320 155, 1440 140 L1440 200 L0 200 Z;
                M0 145 C120 165, 240 150, 360 165 C480 180, 600 155, 720 170 C840 185, 960 160, 1080 175 C1200 190, 1320 165, 1440 155 L1440 200 L0 200 Z;
                M0 170 C120 155, 240 165, 360 150 C480 135, 600 160, 720 145 C840 130, 960 155, 1080 140 C1200 125, 1320 150, 1440 165 L1440 200 L0 200 Z;
                M0 160 C120 145, 240 170, 360 155 C480 140, 600 165, 720 150 C840 135, 960 160, 1080 145 C1200 130, 1320 155, 1440 140 L1440 200 L0 200 Z
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

// Custom icons for features

function CanvasIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18" />
      <path d="M9 21V9" />
      <circle cx="15" cy="15" r="2" />
    </svg>
  );
}

function FrameIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 8h20" />
      <path d="M6 8v12" />
      <path d="M10 12l3 3 5-5" />
    </svg>
  );
}

function BananaIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 13c0-4.97 4.03-9 9-9 2.76 0 5.23 1.24 6.88 3.19" />
      <path d="M20 8c-.5 3.5-2.5 7-6.5 9.5-3.5 2.2-7.5 2.5-10.5 1.5" />
      <path d="M4 13c1.5 0 3 .5 4 1.5" />
      <circle cx="18" cy="6" r="1.5" fill="currentColor" />
    </svg>
  );
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
      <path d="M18 14l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3z" />
      <path d="M5 17l.5 1.5L7 19l-1.5.5L5 21l-.5-1.5L3 19l1.5-.5L5 17z" />
    </svg>
  );
}

function KeyIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="15" r="4" />
      <path d="M11.3 11.7L15 8l2 2" />
      <path d="M15 8l4-4" />
      <path d="M17 6l2 2" />
    </svg>
  );
}

function ExportIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function ReplicateIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z" />
    </svg>
  );
}
