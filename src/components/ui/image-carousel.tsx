"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
interface ImageCarouselProps {
  images: string[];
  alt: string;
  className?: string;
  currentIndex: number;
  onSetCurrentIndex?: React.Dispatch<React.SetStateAction<number>>;
  didPause: boolean;
}

export function ImageCarousel({
  images,
  alt,
  className,
  currentIndex,
  onSetCurrentIndex,
  didPause,
}: ImageCarouselProps) {
  const autoAdvanceTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const handleInteraction = () => {
    // Clear existing interaction timeout
    clearTimeout(autoAdvanceTimerRef.current);
  };

  const next = () => {
    const nextIndex = (currentIndex + 1) % images.length;
    onSetCurrentIndex?.(nextIndex);
    handleInteraction();
  };

  const previous = () => {
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    onSetCurrentIndex?.(prevIndex);
    handleInteraction();
  };

  useEffect(() => {
    if (didPause) {
      clearTimeout(autoAdvanceTimerRef.current);
    }
  }, [didPause]);

  // Setup auto-advance
  useEffect(() => {
    autoAdvanceTimerRef.current = setInterval(() => {
      onSetCurrentIndex?.((index) => {
        const nextIndex = (index + 1) % images.length;
        return nextIndex;
      });
    }, 10000);

    return () => {
      clearInterval(autoAdvanceTimerRef.current);
    };
  }, [onSetCurrentIndex, images.length]);

  if (!images.length) return null;

  return (
    <div className={cn("group relative", className)}>
      <div className="overflow-hidden">
        <div className="relative aspect-[2/1]">
          {images.map((image, index) => (
            <Image
              key={image}
              src={image}
              alt={`${alt} - Image ${currentIndex + 1}`}
              fill
              sizes={"(max-width: 768px) 100vw, 500px"}
              priority={index === 0}
              className={cn(
                "object-cover transition-opacity duration-1000",
                currentIndex === index ? "opacity-100" : "opacity-0",
              )}
            />
          ))}
        </div>
      </div>

      {images.length > 1 && (
        <>
          <Button
            variant="secondary"
            size="icon"
            className="absolute top-1/2 left-2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-50 hover:!opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              previous();
            }}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="secondary"
            size="icon"
            className="absolute top-1/2 right-2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-50 hover:!opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
            {images.map((_, index) => (
              <button
                key={index}
                className={cn(
                  "h-2 w-2 rounded-full transition-all",
                  index === currentIndex
                    ? "bg-white"
                    : "bg-white/50 hover:bg-white/75",
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  handleInteraction();
                  onSetCurrentIndex?.(index);
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
