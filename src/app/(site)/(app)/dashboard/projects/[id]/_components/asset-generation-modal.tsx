"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles, Loader2, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { api } from "@/trpc/react";
import { InsufficientCreditModal } from "@/components/shared/insufficient-credit-modal";
import { ASPECT_RATIOS, type AspectRatio } from "@/lib/utils/image";

interface AssetGenerationModalProps {
  projectId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AssetGenerationModal({
  projectId,
  open,
  onOpenChange,
}: AssetGenerationModalProps) {
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("1:1");
  const [transparentBackground, setTransparentBackground] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showInsufficientCreditModal, setShowInsufficientCreditModal] =
    useState(false);

  const utils = api.useUtils();

  const generateAssetMutation = api.generation.createAsset.useMutation({
    onSuccess: () => {
      void utils.generation.list.invalidate({ projectId });
      void utils.project.getById.invalidate({ id: projectId });
      void utils.generation.getCreditsStatus.invalidate(); // Refresh credits
      setPrompt("");
      setIsGenerating(false);
      onOpenChange(false);
    },
    onError: (error) => {
      console.error("Asset generation failed:", error);
      setIsGenerating(false);

      // Check for insufficient credit error
      if (error.message === "REPLICATE_INSUFFICIENT_CREDIT") {
        setShowInsufficientCreditModal(true);
      }
    },
  });

  const handleGenerate = () => {
    if (!prompt.trim()) return;

    const extras = transparentBackground
      ? [
          "Make sure the entire object is in view, and not cropped.",
          "Generate the object on a white background.",
        ]
      : [];

    setIsGenerating(true);
    generateAssetMutation.mutate({
      projectId,
      prompt: [prompt.trim(), ...extras].join("\n"),
      aspectRatio,
      transparentBackground,
    });
  };

  const handleClose = (newOpen: boolean) => {
    if (!newOpen && !isGenerating) {
      setPrompt("");
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
            <DialogTitle>Generate Asset</DialogTitle>
            <DialogDescription>
              Create a standalone image asset that can be composited within
              frames.
            </DialogDescription>
          </DialogHeader>

          <Alert className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
            <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertDescription className="text-blue-800 dark:text-blue-200">
              This is a text-to-image generator for creating standalone assets
              (characters, objects, items) that you can then composite into your
              frames.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="asset-prompt">Prompt</Label>
              <Textarea
                id="asset-prompt"
                placeholder="Describe the asset you want to generate..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="aspect-ratio">Aspect Ratio</Label>
              <Select
                value={aspectRatio}
                onValueChange={(value) => setAspectRatio(value as AspectRatio)}
              >
                <SelectTrigger id="aspect-ratio">
                  <SelectValue placeholder="Select aspect ratio" />
                </SelectTrigger>
                <SelectContent className="z-[10000]">
                  {ASPECT_RATIOS.map((ratio) => (
                    <SelectItem key={ratio.value} value={ratio.value}>
                      {ratio.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="transparent-background"
                checked={transparentBackground}
                onCheckedChange={(checked) =>
                  setTransparentBackground(checked === true)
                }
              />
              <Label
                htmlFor="transparent-background"
                className="cursor-pointer text-sm font-normal"
              >
                Make background transparent
              </Label>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => handleClose(false)}
              disabled={isGenerating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Asset
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
