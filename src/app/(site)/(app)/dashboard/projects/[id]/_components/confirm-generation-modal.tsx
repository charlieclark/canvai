"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sparkles, Loader2 } from "lucide-react";
import { api } from "@/trpc/react";
import { uploadImage } from "@/lib/utils/upload";
import type { AspectRatio } from "@/lib/utils/image";

interface ConfirmGenerationModalProps {
  projectId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prompt: string;
  previewUrl: string | null;
  aspectRatio: AspectRatio | null;
  onSuccess: () => void;
}

export function ConfirmGenerationModal({
  projectId,
  open,
  onOpenChange,
  prompt,
  previewUrl,
  aspectRatio,
  onSuccess,
}: ConfirmGenerationModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const utils = api.useUtils();

  const generateMutation = api.generation.create.useMutation({
    onSuccess: () => {
      void utils.generation.list.invalidate({ projectId });
      void utils.project.getById.invalidate({ id: projectId });
      setIsGenerating(false);
      onOpenChange(false);
      onSuccess();
    },
    onError: (error) => {
      console.error("Generation failed:", error);
      setIsGenerating(false);
    },
  });

  const handleConfirm = async () => {
    if (!previewUrl || !aspectRatio) return;

    setIsGenerating(true);

    try {
      const response = await fetch(previewUrl);
      const blob = await response.blob();
      const file = new File([blob], `frame-${Date.now()}.png`, {
        type: "image/webp",
      });

      const referenceImage = await uploadImage(file);

      generateMutation.mutate({
        projectId,
        prompt: prompt.trim(),
        aspectRatio,
        referenceImage,
      });
    } catch (error) {
      console.error("Failed to upload frame image:", error);
      setIsGenerating(false);
    }
  };

  const handleClose = (newOpen: boolean) => {
    if (!newOpen && !isGenerating) {
      // Cleanup preview URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Generation</DialogTitle>
          <DialogDescription>
            Review the frame that will be used as a reference for your
            generation.
          </DialogDescription>
        </DialogHeader>

        {/* Preview Image */}
        {previewUrl && (
          <div className="bg-muted relative aspect-square w-full overflow-hidden rounded-lg border">
            <Image
              src={previewUrl}
              alt="Frame preview"
              fill
              className="object-contain"
            />
          </div>
        )}

        {/* Prompt Preview */}
        <div className="space-y-1">
          <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
            Prompt
          </p>
          <p className="text-sm">{prompt}</p>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => handleClose(false)}
            disabled={isGenerating}
          >
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

