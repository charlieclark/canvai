"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw, ImageIcon } from "lucide-react";
import Image from "next/image";

interface FramePreviewProps {
  previewUrl: string | null;
  onRefresh: () => void;
}

export function FramePreview({ previewUrl, onRefresh }: FramePreviewProps) {
  return (
    <div className="bg-muted relative aspect-video overflow-hidden rounded-lg border">
      {previewUrl ? (
        <>
          <Image
            src={previewUrl}
            alt="Frame preview"
            fill
            className="object-contain"
            unoptimized // Blob URLs need unoptimized
          />
          <Button
            size="icon"
            variant="secondary"
            className="absolute right-2 top-2 h-7 w-7"
            onClick={onRefresh}
            title="Refresh preview"
          >
            <RefreshCw className="h-3 w-3" />
          </Button>
        </>
      ) : (
        <div className="flex h-full flex-col items-center justify-center">
          <ImageIcon className="text-muted-foreground mb-2 h-8 w-8" />
          <p className="text-muted-foreground text-xs">Loading preview...</p>
        </div>
      )}
    </div>
  );
}



