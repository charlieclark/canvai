"use client";

import { Paintbrush, Layers, Wand2, Download, Palette, Zap } from "lucide-react";

const features = [
  {
    icon: Paintbrush,
    title: "Infinite Canvas",
    description:
      "Work on a boundless creative space. Pan, zoom, and organize your ideas without constraints.",
    color: "#0066CC",
  },
  {
    icon: Wand2,
    title: "AI Generation",
    description:
      "Transform sketches and layouts into polished visuals with cutting-edge AI models.",
    color: "#059669",
  },
  {
    icon: Layers,
    title: "Frame-Based Workflow",
    description:
      "Create frames at any aspect ratio. Design within them, then generate stunning outputs.",
    color: "#0891B2",
  },
  {
    icon: Palette,
    title: "Style Control",
    description:
      "Guide the AI with your designs. Your frame content becomes the reference for generation.",
    color: "#F97316",
  },
  {
    icon: Download,
    title: "Export Anywhere",
    description:
      "Download your creations in multiple formats. Perfect for social media, print, or web.",
    color: "#EC4899",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Generate high-quality images in seconds. Iterate quickly and explore endless variations.",
    color: "#8B5CF6",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="relative bg-white py-24 md:py-32">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <svg width="100%" height="100%">
          <pattern
            id="grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="20" cy="20" r="1" fill="currentColor" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-screen-xl px-6">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-[#0066CC]">
            Features
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-[#0066CC] via-[#0891B2] to-[#059669] bg-clip-text text-transparent">
              create
            </span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-slate-600">
            A powerful toolkit designed for modern creators. From concept to
            completion, CanvAi has you covered.
          </p>
        </div>

        {/* Features grid */}
        <div className="mt-16 grid gap-6 md:mt-20 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative rounded-2xl border border-slate-100 bg-white p-8 shadow-sm transition-all duration-300 hover:border-slate-200 hover:shadow-lg"
            >
              {/* Color accent */}
              <div
                className="absolute -right-px -top-px h-24 w-24 rounded-tr-2xl opacity-[0.08] transition-opacity group-hover:opacity-[0.15]"
                style={{
                  background: `linear-gradient(135deg, ${feature.color}, transparent)`,
                }}
              />

              {/* Icon */}
              <div
                className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl"
                style={{
                  backgroundColor: `${feature.color}12`,
                }}
              >
                <feature.icon
                  className="h-6 w-6"
                  style={{ color: feature.color }}
                />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-slate-900">
                {feature.title}
              </h3>
              <p className="mt-3 leading-relaxed text-slate-600">
                {feature.description}
              </p>

              {/* Hover line */}
              <div
                className="absolute bottom-0 left-8 right-8 h-0.5 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
                style={{ backgroundColor: feature.color }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
