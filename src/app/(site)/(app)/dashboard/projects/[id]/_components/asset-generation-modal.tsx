"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  const [isGenerating, setIsGenerating] = useState(false);

  const utils = api.useUtils();

  const generateAssetMutation = api.generation.createAsset.useMutation({
    onSuccess: () => {
      void utils.generation.list.invalidate({ projectId });
      void utils.project.getById.invalidate({ id: projectId });
      setPrompt("");
      setIsGenerating(false);
      onOpenChange(false);
    },
    onError: (error) => {
      console.error("Asset generation failed:", error);
      setIsGenerating(false);
    },
  });

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    generateAssetMutation.mutate({
      projectId,
      prompt: prompt.trim(),
    });
  };

  const handleClose = (newOpen: boolean) => {
    if (!newOpen && !isGenerating) {
      setPrompt("");
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Generate Asset</DialogTitle>
          <DialogDescription>
            Create a standalone image asset that can be composited within
            frames.
          </DialogDescription>
        </DialogHeader>

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
            <p className="text-muted-foreground text-xs">
              Assets are generated as 1:1 square images.
            </p>
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
  );
}


