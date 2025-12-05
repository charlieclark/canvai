"use client";

import { useState, useEffect, useCallback } from "react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Frame, Loader2, Plus } from "lucide-react";
import type { Editor, TLShapeId } from "tldraw";
import { api } from "@/trpc/react";
import { FramePreview } from "./frame-preview";

// Scale factor for displaying frames at a reasonable size on canvas
const FRAME_DISPLAY_SCALE = 0.5;

const ASPECT_RATIOS = [
  { value: "1:1", label: "1:1 (Square)", width: 1024, height: 1024 },
  { value: "16:9", label: "16:9 (Landscape)", width: 1344, height: 768 },
  { value: "9:16", label: "9:16 (Portrait)", width: 768, height: 1344 },
  { value: "4:3", label: "4:3 (Standard)", width: 1152, height: 896 },
  { value: "3:2", label: "3:2 (Photo)", width: 1216, height: 832 },
] as const;

type AspectRatio = (typeof ASPECT_RATIOS)[number]["value"];

interface GeneratePanelProps {
  projectId: string;
  editor: Editor | null;
  selectedFrameId: TLShapeId | null;
}

export function GeneratePanel({
  projectId,
  editor,
  selectedFrameId,
}: GeneratePanelProps) {
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("1:1");
  const [newFrameAspectRatio, setNewFrameAspectRatio] =
    useState<AspectRatio>("1:1");
  const [isGenerating, setIsGenerating] = useState(false);
  const [framePreviewUrl, setFramePreviewUrl] = useState<string | null>(null);

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

  const generateMutation = api.generation.generateSync.useMutation({
    onSuccess: () => {
      void utils.project.getById.invalidate({ id: projectId });
      setPrompt("");
      setIsGenerating(false);
    },
    onError: (error) => {
      console.error("Generation failed:", error);
      setIsGenerating(false);
    },
  });

  // Export frame as image when selected
  const exportFrameAsImage = useCallback(async () => {
    if (!editor || !selectedFrameId) {
      setFramePreviewUrl(null);
      return;
    }

    try {
      const shape = editor.getShape(selectedFrameId);
      if (shape?.type !== "frame") {
        setFramePreviewUrl(null);
        return;
      }

      // Export the frame and its contents as an image
      const { blob } = await editor.toImage([selectedFrameId], {
        format: "png",
        background: true,
      });

      const url = URL.createObjectURL(blob);
      setFramePreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return url;
      });
    } catch (error) {
      console.error("Failed to export frame:", error);
      setFramePreviewUrl(null);
    }
  }, [editor, selectedFrameId]);

  // Update preview when frame selection changes
  useEffect(() => {
    void exportFrameAsImage();
  }, [exportFrameAsImage]);

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (framePreviewUrl) {
        URL.revokeObjectURL(framePreviewUrl);
      }
    };
  }, [framePreviewUrl]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);

    // Get the reference image from the frame
    let referenceImage: string | undefined;
    if (framePreviewUrl) {
      try {
        // Convert blob URL to base64 data URL
        const response = await fetch(framePreviewUrl);
        const blob = await response.blob();
        const reader = new FileReader();
        referenceImage = await new Promise((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });
      } catch (error) {
        console.error("Failed to convert frame to base64:", error);
      }
    }

    generateMutation.mutate({
      projectId,
      prompt: prompt.trim(),
      aspectRatio,
      referenceImage,
    });
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
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-muted/30 flex h-full w-80 flex-col border-l">
      <div className="border-b p-4">
        <h2 className="font-semibold">Generate</h2>
        <p className="text-muted-foreground text-xs">
          Frame selected - ready to generate
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-6 p-4">
          {/* Frame Preview */}
          <div className="space-y-2">
            <Label>Frame Preview</Label>
            <FramePreview
              previewUrl={framePreviewUrl}
              onRefresh={exportFrameAsImage}
            />
          </div>

          {/* Aspect Ratio */}
          <div className="space-y-2">
            <Label htmlFor="aspect-ratio">Output Size</Label>
            <Select
              value={aspectRatio}
              onValueChange={(v) => setAspectRatio(v as AspectRatio)}
            >
              <SelectTrigger id="aspect-ratio">
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
              {ASPECT_RATIOS.find((r) => r.value === aspectRatio)?.width} ×{" "}
              {ASPECT_RATIOS.find((r) => r.value === aspectRatio)?.height}px
            </p>
          </div>

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
              The frame contents will be used as a reference for the generation.
            </p>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="w-full"
            size="lg"
          >
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
        </div>
      </ScrollArea>
    </div>
  );
}
