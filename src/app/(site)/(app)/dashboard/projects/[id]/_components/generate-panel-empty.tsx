"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Frame, Plus, Coins } from "lucide-react";
import type { Editor } from "tldraw";
import { api } from "@/trpc/react";
import {
  ASPECT_RATIOS,
  RESOLUTIONS,
  getGenerationDimensions,
  type AspectRatio,
  type Resolution,
} from "@/lib/utils/image";
import { GenerationOptionsModal } from "@/components/shared/generation-options-modal";
import { useState } from "react";

interface GeneratePanelEmptyProps {
  editor: Editor | null;
  newFrameAspectRatio: AspectRatio;
  onNewFrameAspectRatioChange: (ratio: AspectRatio) => void;
  resolution: Resolution;
  onResolutionChange: (resolution: Resolution) => void;
  onCreateFrame: () => void;
}

export function GeneratePanelEmpty({
  editor,
  newFrameAspectRatio,
  onNewFrameAspectRatioChange,
  resolution,
  onResolutionChange,
  onCreateFrame,
}: GeneratePanelEmptyProps) {
  const [generationOptionsModalOpen, setGenerationOptionsModalOpen] =
    useState(false);

  // Get credits status (includes subscription info and API key status)
  const { data: creditsStatus } = api.generation.getCreditsStatus.useQuery();

  const selectedRatio = ASPECT_RATIOS.find(
    (r) => r.value === newFrameAspectRatio,
  );

  // Credits display component
  const CreditsDisplay = () => {
    if (creditsStatus?.plan !== "SUBSCRIBED") return null;

    return (
      <div className="flex items-center gap-2 rounded-md bg-amber-50 px-3 py-2 text-sm dark:bg-amber-950">
        <Coins className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        <span className="font-medium text-amber-900 dark:text-amber-100">
          {creditsStatus.credits} credits
        </span>
      </div>
    );
  };

  return (
    <>
      <div className="bg-muted/30 flex h-full w-80 flex-col border-l">
        <div className="space-y-2 border-b p-4">
          <h2 className="font-semibold">Generate</h2>
          <CreditsDisplay />
        </div>

        <div className="flex flex-1 flex-col p-6">
          {/* Frame creation section */}
          <div className="mb-6 text-center">
            <div className="bg-muted mx-auto mb-4 w-fit rounded-full p-4">
              <Frame className="text-muted-foreground h-8 w-8" />
            </div>
            <h3 className="mb-2 font-medium">No frame selected</h3>
            <p className="text-muted-foreground text-sm">
              Create a frame to get started, or select an existing frame on the
              canvas.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-frame-aspect-ratio">Frame Size</Label>
              <Select
                value={newFrameAspectRatio}
                onValueChange={(v) =>
                  onNewFrameAspectRatioChange(v as AspectRatio)
                }
              >
                <SelectTrigger id="new-frame-aspect-ratio">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ASPECT_RATIOS.map((ratio) => (
                    <SelectItem key={ratio.value} value={ratio.value}>
                      {ratio.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="resolution">Resolution</Label>
              <Select
                value={String(resolution)}
                onValueChange={(v) => onResolutionChange(Number(v) as Resolution)}
              >
                <SelectTrigger id="resolution">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RESOLUTIONS.map((res) => (
                    <SelectItem key={res.value} value={String(res.value)}>
                      {res.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-muted-foreground text-xs">
                {selectedRatio &&
                  `${getGenerationDimensions(newFrameAspectRatio, resolution).width} × ${getGenerationDimensions(newFrameAspectRatio, resolution).height}px`}
              </p>
            </div>

            <Button
              onClick={onCreateFrame}
              disabled={!editor}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Frame
            </Button>
          </div>
        </div>
      </div>

      <GenerationOptionsModal
        open={generationOptionsModalOpen}
        onOpenChange={setGenerationOptionsModalOpen}
      />
    </>
  );
}
