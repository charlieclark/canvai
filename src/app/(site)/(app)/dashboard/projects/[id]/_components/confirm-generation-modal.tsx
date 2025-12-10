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
import {
  ACTION_PRESETS,
  STYLE_PRESETS,
  ENHANCEMENT_FILTERS,
} from "@/config/generation-presets";

interface GenerationSelections {
  userPrompt: string;
  selectedAction: string | null;
  selectedStyles: string[];
  selectedFilters: string[];
}

interface ConfirmGenerationModalProps {
  projectId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prompt: string; // The built prompt for API
  selections: GenerationSelections; // User selections for display
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
  selections,
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
      const file = new File([blob], `frame-${Date.now()}.jpg`, {
        type: "image/jpeg",
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

  // Get display labels for selections
  const actionLabel = selections.selectedAction
    ? ACTION_PRESETS.find((a) => a.id === selections.selectedAction)?.label
    : null;

  const styleLabels = selections.selectedStyles
    .map((id) => STYLE_PRESETS.find((s) => s.id === id)?.label)
    .filter(Boolean);

  const filterLabels = selections.selectedFilters
    .map((id) => ENHANCEMENT_FILTERS.find((f) => f.id === id)?.label)
    .filter(Boolean);

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
              Review your generation settings before proceeding.
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

          {/* Generation Settings Summary */}
          <div className="space-y-3">
            {/* Action */}
            {actionLabel && (
              <div className="flex items-start gap-2">
                <span className="text-muted-foreground min-w-20 text-xs font-medium">
                  Action
                </span>
                <span className="text-sm">{actionLabel}</span>
              </div>
            )}

            {/* Custom Prompt */}
            {selections.userPrompt.trim() && (
              <div className="flex items-start gap-2">
                <span className="text-muted-foreground min-w-20 text-xs font-medium">
                  Prompt
                </span>
                <span className="text-sm">{selections.userPrompt.trim()}</span>
              </div>
            )}

            {/* Styles */}
            {styleLabels.length > 0 && (
              <div className="flex items-start gap-2">
                <span className="text-muted-foreground min-w-20 text-xs font-medium">
                  Style
                </span>
                <span className="text-sm">{styleLabels.join(", ")}</span>
              </div>
            )}

            {/* Enhancements */}
            {filterLabels.length > 0 && (
              <div className="flex items-start gap-2">
                <span className="text-muted-foreground min-w-20 text-xs font-medium">
                  Enhance
                </span>
                <span className="text-sm">{filterLabels.join(", ")}</span>
              </div>
            )}

            {/* Output Dimensions */}
            {aspectRatio && (
              <div className="flex items-start gap-2">
                <span className="text-muted-foreground min-w-20 text-xs font-medium">
                  Output
                </span>
                <span className="text-sm">
                  {getGenerationDimensions(aspectRatio, resolution).width} ×{" "}
                  {getGenerationDimensions(aspectRatio, resolution).height}px
                  <span className="text-muted-foreground ml-1">
                    ({resolution === 2 ? "2K" : "1K"})
                  </span>
                </span>
              </div>
            )}
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
    </>
  );
}
