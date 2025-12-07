"use client";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import Script from "next/script";
import { useInView } from "@/hooks/use-in-view";

interface VideoSectionProps {
  className?: string;
}

interface VimeoPlayer {
  on: (event: string, callback: () => void) => void;
  play: () => Promise<void>;
  pause: () => Promise<void>;
}

interface VimeoSDK {
  Player: new (
    element: string,
    options: {
      id: number;
      autoplay: boolean;
      loop: boolean;
      muted: boolean;
      controls: boolean;
      background: boolean;
    },
  ) => VimeoPlayer;
}

declare global {
  interface Window {
    Vimeo?: VimeoSDK;
  }
}

export default function VideoSection({ className }: VideoSectionProps) {
  const { ref: containerRef, isInView } = useInView<HTMLDivElement>({
    threshold: 0.2,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const playerRef = useRef<VimeoPlayer | null>(null);

  useEffect(() => {
    // Initialize the player when the SDK is loaded
    if (typeof window !== "undefined" && window.Vimeo) {
      console.log("LOADING");
      const player = new window.Vimeo.Player("vimeo-player", {
        id: 1144249043,
        autoplay: false,
        loop: true,
        muted: true,
        controls: false,
        background: false,
      });

      player.on("play", () => {
        setIsLoading(false);
      });

      playerRef.current = player;
    }
  }, [isScriptLoaded]);

  // Play/pause based on visibility
  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    console.log({ isInView });

    if (isInView) {
      player.play().catch(console.error);
    } else {
      player.pause().catch(console.error);
    }
  }, [isInView]);

  return (
    <div ref={containerRef} className={cn("w-full", className)}>
      <Script
        src="https://player.vimeo.com/api/player.js"
        onLoad={() => {
          setIsScriptLoaded(true);
        }}
      />
      <style jsx global>{`
        #vimeo-player iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: 0;
        }
      `}</style>
      <AspectRatio
        ratio={996 / 564}
        className="pointer-events-none relative w-full overflow-hidden"
      >
        <div
          className={cn(
            "absolute inset-0 z-10 transition-opacity duration-500",
            isLoading ? "opacity-100" : "opacity-0",
          )}
        >
          <Image
            src="/marketing/hero-video-thumbnail.png"
            alt="Video thumbnail"
            fill
            className="object-cover blur-md scale-150"
            priority
          />
        </div>

        <div id="vimeo-player" className="absolute inset-0 h-full w-full" />
      </AspectRatio>
    </div>
  );
}
