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
import type { AspectRatio, Resolution } from "@/lib/utils/image";
import { getGenerationDimensions } from "@/lib/utils/image";
import { InsufficientCreditModal } from "@/components/shared/insufficient-credit-modal";

interface ConfirmGenerationModalProps {
  projectId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prompt: string;
  previewUrl: string | null;
  aspectRatio: AspectRatio | null;
  resolution: Resolution;
  onSuccess: () => void;
}

export function ConfirmGenerationModal({
  projectId,
  open,
  onOpenChange,
  prompt,
  previewUrl,
  aspectRatio,
  resolution,
  onSuccess,
}: ConfirmGenerationModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showInsufficientCreditModal, setShowInsufficientCreditModal] =
    useState(false);

  const utils = api.useUtils();

  const generateMutation = api.generation.create.useMutation({
    onSuccess: () => {
      void utils.generation.list.invalidate({ projectId });
      void utils.project.getById.invalidate({ id: projectId });
      void utils.generation.getCreditsStatus.invalidate(); // Refresh credits
      setIsGenerating(false);
      onOpenChange(false);
      onSuccess();
    },
    onError: (error) => {
      console.error("Generation failed:", error);
      setIsGenerating(false);

      // Check for insufficient credit error
      if (error.message === "REPLICATE_INSUFFICIENT_CREDIT") {
        setShowInsufficientCreditModal(true);
      }
    },
  });

  const handleConfirm = async () => {
    if (!previewUrl || !aspectRatio) return;

    setIsGenerating(true);

    try {
      const response = await fetch(previewUrl);
      const blob = await response.blob();
      const file = new File([blob], `frame-${Date.now()}.webp`, {
        type: "image/webp",
      });

      const referenceImage = await uploadImage(file);

      generateMutation.mutate({
        projectId,
        prompt: prompt.trim(),
        aspectRatio,
        resolution,
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
    <>
      <InsufficientCreditModal
        open={showInsufficientCreditModal}
        onOpenChange={setShowInsufficientCreditModal}
      />
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
            <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              Prompt
            </p>
            <p className="text-sm">{prompt}</p>
          </div>

          {/* Output Dimensions */}
          {aspectRatio && (
            <div className="space-y-1">
              <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                Output Resolution
              </p>
              <p className="text-sm">
                {getGenerationDimensions(aspectRatio, resolution).width} ×{" "}
                {getGenerationDimensions(aspectRatio, resolution).height}px
                <span className="text-muted-foreground ml-2">
                  ({resolution === 2 ? "2K" : "1K"})
                </span>
              </p>
            </div>
          )}

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
    </>
  );
}
