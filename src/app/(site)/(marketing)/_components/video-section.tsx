"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

interface VideoSectionProps {
  className?: string;
}

export function VideoSection({ className }: VideoSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {
              // Autoplay may be blocked, that's okay
            });
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.2 },
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      {/* Loading placeholder */}
      <div
        className={cn(
          "absolute inset-0 z-10 bg-slate-100 transition-opacity duration-500",
          isLoading ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
      >
        <div className="flex h-full w-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
        </div>
      </div>

      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        loop
        muted
        playsInline
        onCanPlay={() => setIsLoading(false)}
      >
        <source src="/about.mp4" type="video/mp4" />
      </video>
    </div>
  );
}

