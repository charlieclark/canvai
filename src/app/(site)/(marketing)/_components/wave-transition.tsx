"use client";

import { useEffect, useRef } from "react";

import { useInView } from "@/hooks/use-in-view";

interface WaveGradient {
  id: string;
  colors: { offset: string; color: string }[];
}

interface WaveLayer {
  gradient?: string; // gradient ID or solid color
  fill?: string; // solid fill color (if no gradient)
  opacity: number;
  duration: number;
  paths: string[];
}

interface WaveTransitionProps {
  /** Height of the wave container */
  height?: number;
  /** Gradient definitions for the waves */
  gradients?: WaveGradient[];
  /** Wave layers from back to front */
  layers: WaveLayer[];
  /** Additional className for the container */
  className?: string;
}

export function WaveTransition({
  height = 200,
  gradients = [],
  layers,
  className = "",
}: WaveTransitionProps) {
  const { ref: containerRef, isInView } = useInView<HTMLDivElement>({
    threshold: 0,
    rootMargin: "50px",
  });
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    if (isInView) {
      svg.unpauseAnimations();
    } else {
      svg.pauseAnimations();
    }
  }, [isInView]);

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none absolute right-0 bottom-0 left-0 ${className}`}
      style={{
        height,
        contain: "layout style paint",
        contentVisibility: "auto",
        containIntrinsicSize: `auto ${height}px`,
      }}
    >
      <svg
        ref={svgRef}
        viewBox={`0 0 1440 ${height}`}
        fill="none"
        preserveAspectRatio="xMidYMax slice"
        className="h-full w-full"
        style={{ willChange: isInView ? "contents" : "auto" }}
      >
        {gradients.length > 0 && (
          <defs>
            {gradients.map((gradient) => (
              <linearGradient
                key={gradient.id}
                id={gradient.id}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                {gradient.colors.map((stop, i) => (
                  <stop key={i} offset={stop.offset} stopColor={stop.color} />
                ))}
              </linearGradient>
            ))}
          </defs>
        )}

        {layers.map((layer, index) => (
          <path
            key={index}
            fill={layer.gradient ? `url(#${layer.gradient})` : layer.fill}
            opacity={layer.opacity}
          >
            <animate
              attributeName="d"
              dur={`${layer.duration}s`}
              repeatCount="indefinite"
              values={layer.paths.join(";")}
              calcMode="spline"
              keySplines={Array(layer.paths.length - 1)
                .fill("0.4 0 0.6 1")
                .join("; ")}
            />
          </path>
        ))}
      </svg>
    </div>
  );
}

// Pre-configured wave presets for common transitions

/** Cream to Dark transition (used in Hero) */
export const creamToDarkWave = {
  height: 400,
  gradients: [
    {
      id: "wave-blue-teal",
      colors: [
        { offset: "0%", color: "#0066CC" },
        { offset: "30%", color: "#0891B2" },
        { offset: "60%", color: "#059669" },
        { offset: "100%", color: "#10B981" },
      ],
    },
    {
      id: "wave-orange",
      colors: [
        { offset: "0%", color: "#F97316" },
        { offset: "50%", color: "#FB923C" },
        { offset: "100%", color: "#FBBF24" },
      ],
    },
    {
      id: "wave-pink",
      colors: [
        { offset: "0%", color: "#EC4899" },
        { offset: "100%", color: "#F472B6" },
      ],
    },
  ],
  layers: [
    {
      gradient: "wave-blue-teal",
      opacity: 0.85,
      duration: 8,
      paths: [
        "M0 180 C120 140, 240 200, 360 170 C480 140, 600 190, 720 160 C840 130, 960 180, 1080 150 C1200 120, 1320 170, 1440 140 L1440 400 L0 400 Z",
        "M0 160 C120 200, 240 150, 360 180 C480 210, 600 160, 720 190 C840 220, 960 170, 1080 200 C1200 230, 1320 180, 1440 160 L1440 400 L0 400 Z",
        "M0 190 C120 150, 240 190, 360 160 C480 130, 600 180, 720 150 C840 120, 960 170, 1080 140 C1200 110, 1320 160, 1440 180 L1440 400 L0 400 Z",
        "M0 180 C120 140, 240 200, 360 170 C480 140, 600 190, 720 160 C840 130, 960 180, 1080 150 C1200 120, 1320 170, 1440 140 L1440 400 L0 400 Z",
      ],
    },
    {
      gradient: "wave-orange",
      opacity: 0.75,
      duration: 6,
      paths: [
        "M0 240 C120 210, 240 260, 360 230 C480 200, 600 250, 720 220 C840 190, 960 240, 1080 210 C1200 180, 1320 230, 1440 200 L1440 400 L0 400 Z",
        "M0 220 C120 260, 240 210, 360 240 C480 270, 600 220, 720 250 C840 280, 960 230, 1080 260 C1200 290, 1320 240, 1440 220 L1440 400 L0 400 Z",
        "M0 250 C120 220, 240 250, 360 220 C480 190, 600 240, 720 210 C840 180, 960 230, 1080 200 C1200 170, 1320 220, 1440 240 L1440 400 L0 400 Z",
        "M0 240 C120 210, 240 260, 360 230 C480 200, 600 250, 720 220 C840 190, 960 240, 1080 210 C1200 180, 1320 230, 1440 200 L1440 400 L0 400 Z",
      ],
    },
    {
      gradient: "wave-pink",
      opacity: 0.6,
      duration: 5,
      paths: [
        "M0 290 C120 270, 240 300, 360 280 C480 260, 600 290, 720 270 C840 250, 960 280, 1080 260 C1200 240, 1320 270, 1440 250 L1440 400 L0 400 Z",
        "M0 270 C120 300, 240 270, 360 290 C480 310, 600 280, 720 300 C840 320, 960 290, 1080 310 C1200 330, 1320 300, 1440 280 L1440 400 L0 400 Z",
        "M0 300 C120 280, 240 290, 360 270 C480 250, 600 280, 720 260 C840 240, 960 270, 1080 250 C1200 230, 1320 260, 1440 290 L1440 400 L0 400 Z",
        "M0 290 C120 270, 240 300, 360 280 C480 260, 600 290, 720 270 C840 250, 960 280, 1080 260 C1200 240, 1320 270, 1440 250 L1440 400 L0 400 Z",
      ],
    },
    {
      fill: "#0f172b",
      opacity: 1,
      duration: 7,
      paths: [
        "M0 340 C120 325, 240 350, 360 335 C480 320, 600 345, 720 330 C840 315, 960 340, 1080 325 C1200 310, 1320 335, 1440 320 L1440 400 L0 400 Z",
        "M0 325 C120 345, 240 330, 360 345 C480 360, 600 335, 720 350 C840 365, 960 340, 1080 355 C1200 370, 1320 345, 1440 335 L1440 400 L0 400 Z",
        "M0 350 C120 335, 240 345, 360 330 C480 315, 600 340, 720 325 C840 310, 960 335, 1080 320 C1200 305, 1320 330, 1440 345 L1440 400 L0 400 Z",
        "M0 340 C120 325, 240 350, 360 335 C480 320, 600 345, 720 330 C840 315, 960 340, 1080 325 C1200 310, 1320 335, 1440 320 L1440 400 L0 400 Z",
      ],
    },
  ],
} satisfies Omit<WaveTransitionProps, "className">;

/** Dark to Cream transition (used after Features) */
export const darkToCreamWave = {
  height: 200,
  gradients: [],
  layers: [
    {
      fill: "#F5F3EE",
      opacity: 1,
      duration: 7,
      paths: [
        "M0 160 C120 145, 240 170, 360 155 C480 140, 600 165, 720 150 C840 135, 960 160, 1080 145 C1200 130, 1320 155, 1440 140 L1440 200 L0 200 Z",
        "M0 145 C120 165, 240 150, 360 165 C480 180, 600 155, 720 170 C840 185, 960 160, 1080 175 C1200 190, 1320 165, 1440 155 L1440 200 L0 200 Z",
        "M0 170 C120 155, 240 165, 360 150 C480 135, 600 160, 720 145 C840 130, 960 155, 1080 140 C1200 125, 1320 150, 1440 165 L1440 200 L0 200 Z",
        "M0 160 C120 145, 240 170, 360 155 C480 140, 600 165, 720 150 C840 135, 960 160, 1080 145 C1200 130, 1320 155, 1440 140 L1440 200 L0 200 Z",
      ],
    },
  ],
} satisfies Omit<WaveTransitionProps, "className">;

/** Cream to Dark transition (used after CTA, more compact) */
export const creamToDarkWaveCompact = {
  height: 200,
  gradients: [
    {
      id: "cta-wave-blue",
      colors: [
        { offset: "0%", color: "#0066CC" },
        { offset: "30%", color: "#0891B2" },
        { offset: "60%", color: "#059669" },
        { offset: "100%", color: "#10B981" },
      ],
    },
    {
      id: "cta-wave-orange",
      colors: [
        { offset: "0%", color: "#F97316" },
        { offset: "50%", color: "#FB923C" },
        { offset: "100%", color: "#FBBF24" },
      ],
    },
    {
      id: "cta-wave-pink",
      colors: [
        { offset: "0%", color: "#EC4899" },
        { offset: "100%", color: "#F472B6" },
      ],
    },
  ],
  layers: [
    {
      gradient: "cta-wave-blue",
      opacity: 0.7,
      duration: 8,
      paths: [
        "M0 90 C120 60, 240 110, 360 80 C480 50, 600 100, 720 70 C840 40, 960 90, 1080 60 C1200 30, 1320 80, 1440 50 L1440 200 L0 200 Z",
        "M0 70 C120 100, 240 60, 360 90 C480 120, 600 70, 720 100 C840 130, 960 80, 1080 110 C1200 140, 1320 90, 1440 70 L1440 200 L0 200 Z",
        "M0 100 C120 70, 240 90, 360 60 C480 30, 600 80, 720 50 C840 20, 960 70, 1080 40 C1200 10, 1320 60, 1440 90 L1440 200 L0 200 Z",
        "M0 90 C120 60, 240 110, 360 80 C480 50, 600 100, 720 70 C840 40, 960 90, 1080 60 C1200 30, 1320 80, 1440 50 L1440 200 L0 200 Z",
      ],
    },
    {
      gradient: "cta-wave-orange",
      opacity: 0.6,
      duration: 6,
      paths: [
        "M0 120 C120 100, 240 140, 360 120 C480 100, 600 130, 720 110 C840 90, 960 130, 1080 110 C1200 90, 1320 120, 1440 100 L1440 200 L0 200 Z",
        "M0 110 C120 140, 240 110, 360 130 C480 150, 600 120, 720 140 C840 160, 960 130, 1080 150 C1200 170, 1320 140, 1440 120 L1440 200 L0 200 Z",
        "M0 130 C120 110, 240 130, 360 110 C480 90, 600 120, 720 100 C840 80, 960 110, 1080 90 C1200 70, 1320 100, 1440 120 L1440 200 L0 200 Z",
        "M0 120 C120 100, 240 140, 360 120 C480 100, 600 130, 720 110 C840 90, 960 130, 1080 110 C1200 90, 1320 120, 1440 100 L1440 200 L0 200 Z",
      ],
    },
    {
      gradient: "cta-wave-pink",
      opacity: 0.5,
      duration: 5,
      paths: [
        "M0 145 C120 130, 240 155, 360 140 C480 125, 600 150, 720 135 C840 120, 960 145, 1080 130 C1200 115, 1320 140, 1440 125 L1440 200 L0 200 Z",
        "M0 135 C120 155, 240 135, 360 150 C480 165, 600 140, 720 155 C840 170, 960 145, 1080 160 C1200 175, 1320 150, 1440 140 L1440 200 L0 200 Z",
        "M0 155 C120 140, 240 150, 360 135 C480 120, 600 145, 720 130 C840 115, 960 140, 1080 125 C1200 110, 1320 135, 1440 150 L1440 200 L0 200 Z",
        "M0 145 C120 130, 240 155, 360 140 C480 125, 600 150, 720 135 C840 120, 960 145, 1080 130 C1200 115, 1320 140, 1440 125 L1440 200 L0 200 Z",
      ],
    },
    {
      fill: "#0f172b",
      opacity: 1,
      duration: 7,
      paths: [
        "M0 165 C120 150, 240 175, 360 160 C480 145, 600 170, 720 155 C840 140, 960 165, 1080 150 C1200 135, 1320 160, 1440 145 L1440 200 L0 200 Z",
        "M0 155 C120 175, 240 160, 360 175 C480 190, 600 165, 720 180 C840 195, 960 170, 1080 185 C1200 200, 1320 175, 1440 165 L1440 200 L0 200 Z",
        "M0 175 C120 160, 240 170, 360 155 C480 140, 600 165, 720 150 C840 135, 960 160, 1080 145 C1200 130, 1320 155, 1440 170 L1440 200 L0 200 Z",
        "M0 165 C120 150, 240 175, 360 160 C480 145, 600 170, 720 155 C840 140, 960 165, 1080 150 C1200 135, 1320 160, 1440 145 L1440 200 L0 200 Z",
      ],
    },
  ],
} satisfies Omit<WaveTransitionProps, "className">;
