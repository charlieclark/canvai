"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Frame, Loader2, Plus, ImageIcon } from "lucide-react";
import type { Editor, TLShapeId } from "tldraw";
import { api } from "@/trpc/react";
import { uploadImage } from "@/lib/utils/upload";
import {
  ASPECT_RATIOS,
  detectAspectRatio,
  type AspectRatio,
} from "@/lib/utils/image";

// Scale factor for displaying frames at a reasonable size on canvas
const FRAME_DISPLAY_SCALE = 1;

interface GeneratePanelProps {
  projectId: string;
  editor: Editor | null;
  selectedFrameId: TLShapeId | null;
}

interface ConfirmModalData {
  previewUrl: string;
  aspectRatio: AspectRatio;
}

export function GeneratePanel({
  projectId,
  editor,
  selectedFrameId,
}: GeneratePanelProps) {
  const [prompt, setPrompt] = useState("");
  const [newFrameAspectRatio, setNewFrameAspectRatio] =
    useState<AspectRatio>("1:1");
  const [isGenerating, setIsGenerating] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmModalData, setConfirmModalData] =
    useState<ConfirmModalData | null>(null);

  // Asset generation state
  const [assetModalOpen, setAssetModalOpen] = useState(false);
  const [assetPrompt, setAssetPrompt] = useState("");
  const [isGeneratingAsset, setIsGeneratingAsset] = useState(false);

  const utils = api.useUtils();

  // Create a new frame on the canvas
  const handleCreateFrame = () => {
    if (!editor) return;

    const ratio = ASPECT_RATIOS.find((r) => r.value === newFrameAspectRatio);
    if (!ratio) return;

    // Scale down for display, keeping aspect ratio
    const displayWidth = ratio.width * FRAME_DISPLAY_SCALE;
    const displayHeight = ratio.height * FRAME_DISPLAY_SCALE;

    // Get all existing frames
    const existingFrames = editor
      .getCurrentPageShapes()
      .filter((shape) => shape.type === "frame");

    // Helper to check if a rectangle overlaps with any existing frame
    const overlapsExistingFrame = (x: number, y: number) => {
      const padding = 40; // Gap between frames
      const newLeft = x;
      const newRight = x + displayWidth;
      const newTop = y;
      const newBottom = y + displayHeight;

      return existingFrames.some((frame) => {
        const bounds = editor.getShapeGeometry(frame).bounds;
        const frameLeft = frame.x - padding;
        const frameRight = frame.x + bounds.width + padding;
        const frameTop = frame.y - padding;
        const frameBottom = frame.y + bounds.height + padding;

        // Check for overlap
        return (
          newLeft < frameRight &&
          newRight > frameLeft &&
          newTop < frameBottom &&
          newBottom > frameTop
        );
      });
    };

    // Start at center (0,0), offset so frame center is at origin
    let x = -displayWidth / 2;
    const y = -displayHeight / 2;
    const stepSize = displayWidth + 60; // Move by frame width + gap

    // Move right until we find a non-overlapping spot
    const maxAttempts = 50;
    for (let i = 0; i < maxAttempts; i++) {
      if (!overlapsExistingFrame(x, y)) {
        break;
      }
      x += stepSize;
    }

    // Generate a unique ID for the frame
    const frameId = `shape:frame-${Date.now()}` as TLShapeId;

    // Create frame at the found position
    editor.createShape({
      id: frameId,
      type: "frame",
      x,
      y,
      props: {
        w: displayWidth,
        h: displayHeight,
        name: `${ratio.label}`,
      },
    });

    // Select the new frame and center the view on it
    editor.select(frameId);
    editor.zoomToSelection({ animation: { duration: 200 } });
  };

  const generateMutation = api.generation.create.useMutation({
    onSuccess: () => {
      // Invalidate list to show the new pending generation
      void utils.generation.list.invalidate({ projectId });
      void utils.project.getById.invalidate({ id: projectId });
      setPrompt("");
      setIsGenerating(false);
      setConfirmModalOpen(false);
      // Cleanup the preview URL
      if (confirmModalData?.previewUrl) {
        URL.revokeObjectURL(confirmModalData.previewUrl);
      }
      setConfirmModalData(null);
    },
    onError: (error) => {
      console.error("Generation failed:", error);
      setIsGenerating(false);
    },
  });

  const generateAssetMutation = api.generation.createAsset.useMutation({
    onSuccess: () => {
      // Invalidate list to show the new pending generation
      void utils.generation.list.invalidate({ projectId });
      void utils.project.getById.invalidate({ id: projectId });
      setAssetPrompt("");
      setIsGeneratingAsset(false);
      setAssetModalOpen(false);
    },
    onError: (error) => {
      console.error("Asset generation failed:", error);
      setIsGeneratingAsset(false);
    },
  });

  // Handle asset generation
  const handleGenerateAsset = () => {
    if (!assetPrompt.trim()) return;

    setIsGeneratingAsset(true);
    generateAssetMutation.mutate({
      projectId,
      prompt: assetPrompt.trim(),
    });
  };

  // Handle asset modal close
  const handleAssetModalClose = (open: boolean) => {
    if (!open && !isGeneratingAsset) {
      setAssetPrompt("");
    }
    setAssetModalOpen(open);
  };

  // Export frame as image for preview
  const exportFrameAsImage = useCallback(async (): Promise<{
    previewUrl: string;
    aspectRatio: AspectRatio;
  } | null> => {
    if (!editor || !selectedFrameId) return null;

    try {
      const shape = editor.getShape(selectedFrameId);
      if (shape?.type !== "frame") return null;

      const bounds = editor.getShapeGeometry(shape).bounds;
      const detectedAspectRatio = detectAspectRatio(
        bounds.width,
        bounds.height,
      );

      // Export the frame and its contents as an image
      const { blob } = await editor.toImage([selectedFrameId], {
        format: "webp",
        background: true,
        quality: 100,
      });

      const url = URL.createObjectURL(blob);
      return { previewUrl: url, aspectRatio: detectedAspectRatio };
    } catch (error) {
      console.error("Failed to export frame:", error);
      return null;
    }
  }, [editor, selectedFrameId]);

  // Show confirmation modal with preview
  const handleGenerateClick = async () => {
    if (!prompt.trim() || !editor || !selectedFrameId) return;

    const data = await exportFrameAsImage();
    if (data) {
      setConfirmModalData(data);
      setConfirmModalOpen(true);
    }
  };

  // Actually run the generation
  const handleConfirmGenerate = async () => {
    if (!confirmModalData) return;

    setIsGenerating(true);

    // Upload the reference image

    try {
      const response = await fetch(confirmModalData.previewUrl);

      const blob = await response.blob();

      const file = new File([blob], `frame-${Date.now()}.png`, {
        type: "image/webp",
      });

      const referenceImage = await uploadImage(file);

      generateMutation.mutate({
        projectId,
        prompt: prompt.trim(),
        aspectRatio: confirmModalData.aspectRatio,
        referenceImage,
      });
    } catch (error) {
      console.error("Failed to upload frame image:", error);
    }
  };

  // Cleanup preview URL when modal closes without generating
  const handleModalClose = (open: boolean) => {
    if (!open && !isGenerating) {
      if (confirmModalData?.previewUrl) {
        URL.revokeObjectURL(confirmModalData.previewUrl);
      }
      setConfirmModalData(null);
    }
    setConfirmModalOpen(open);
  };

  // Empty state - no frame selected
  if (!selectedFrameId) {
    const selectedRatio = ASPECT_RATIOS.find(
      (r) => r.value === newFrameAspectRatio,
    );

    return (
      <div className="bg-muted/30 flex h-full w-80 flex-col border-l">
        <div className="border-b p-4">
          <h2 className="font-semibold">Generate</h2>
        </div>

        <div className="flex flex-1 flex-col p-6">
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
                onValueChange={(v) => setNewFrameAspectRatio(v as AspectRatio)}
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
              <p className="text-muted-foreground text-xs">
                {selectedRatio?.width} × {selectedRatio?.height}px
              </p>
            </div>

            <Button
              onClick={handleCreateFrame}
              disabled={!editor}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Frame
            </Button>

            <Button
              onClick={() => setAssetModalOpen(true)}
              variant="outline"
              className="w-full"
            >
              <ImageIcon className="mr-2 h-4 w-4" />
              Generate Asset
            </Button>
          </div>
        </div>

        {/* Asset Generation Modal */}
        <Dialog open={assetModalOpen} onOpenChange={handleAssetModalClose}>
          <DialogContent className="z-[100000000] sm:max-w-md">
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
                  value={assetPrompt}
                  onChange={(e) => setAssetPrompt(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
                <p className="text-muted-foreground text-xs">
                  Assets are generated as 1:1 square images using FLUX Schnell.
                </p>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => handleAssetModalClose(false)}
                disabled={isGeneratingAsset}
              >
                Cancel
              </Button>
              <Button
                onClick={handleGenerateAsset}
                disabled={!assetPrompt.trim() || isGeneratingAsset}
              >
                {isGeneratingAsset ? (
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
      </div>
    );
  }

  // Get current frame info for display
  const getFrameInfo = () => {
    if (!editor || !selectedFrameId) return null;
    const shape = editor.getShape(selectedFrameId);
    if (shape?.type !== "frame") return null;
    const bounds = editor.getShapeGeometry(shape).bounds;
    const detectedRatio = detectAspectRatio(bounds.width, bounds.height);
    const ratioInfo = ASPECT_RATIOS.find((r) => r.value === detectedRatio);
    return ratioInfo;
  };

  const frameInfo = getFrameInfo();

  return (
    <>
      <div className="bg-muted/30 flex h-full w-80 flex-col border-l">
        <div className="border-b p-4">
          <h2 className="font-semibold">Generate</h2>
          {frameInfo && (
            <p className="text-muted-foreground text-xs">
              {frameInfo.label} ({frameInfo.width}×{frameInfo.height})
            </p>
          )}
        </div>

        <ScrollArea className="flex-1">
          <div className="space-y-6 p-4">
            {/* Prompt */}
            <div className="space-y-2">
              <Label htmlFor="prompt">Prompt</Label>
              <Textarea
                id="prompt"
                placeholder="Describe what you want to generate..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                className="resize-none"
              />
              <p className="text-muted-foreground text-xs">
                The frame contents will be used as a reference for the
                generation.
              </p>
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleGenerateClick}
              disabled={!prompt.trim() || isGenerating}
              className="w-full"
              size="lg"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Generate
            </Button>

            {/* Asset Generation Button */}
            <Button
              onClick={() => setAssetModalOpen(true)}
              variant="outline"
              className="w-full"
            >
              <ImageIcon className="mr-2 h-4 w-4" />
              Generate Asset
            </Button>
          </div>
        </ScrollArea>
      </div>

      {/* Confirmation Modal */}
      <Dialog open={confirmModalOpen} onOpenChange={handleModalClose}>
        <DialogContent className="z-[100000000] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Generation</DialogTitle>
            <DialogDescription>
              Review the frame that will be used as a reference for your
              generation.
            </DialogDescription>
          </DialogHeader>

          {/* Preview Image */}
          {confirmModalData && (
            <div className="bg-muted relative aspect-square w-full overflow-hidden rounded-lg border">
              <Image
                src={confirmModalData.previewUrl}
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

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => handleModalClose(false)}
              disabled={isGenerating}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirmGenerate} disabled={isGenerating}>
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

      {/* Asset Generation Modal */}
      <Dialog open={assetModalOpen} onOpenChange={handleAssetModalClose}>
        <DialogContent className="z-[100000000] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Generate Asset</DialogTitle>
            <DialogDescription>
              Create a standalone image asset that can be composited within
              frames.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="asset-prompt-frame">Prompt</Label>
              <Textarea
                id="asset-prompt-frame"
                placeholder="Describe the asset you want to generate..."
                value={assetPrompt}
                onChange={(e) => setAssetPrompt(e.target.value)}
                rows={4}
                className="resize-none"
              />
              <p className="text-muted-foreground text-xs">
                Assets are generated as 1:1 square images using FLUX Schnell.
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => handleAssetModalClose(false)}
              disabled={isGeneratingAsset}
            >
              Cancel
            </Button>
            <Button
              onClick={handleGenerateAsset}
              disabled={!assetPrompt.trim() || isGeneratingAsset}
            >
              {isGeneratingAsset ? (
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
