"use client";

import { useState, useCallback } from "react";
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
import { Sparkles, Frame, Plus, ImageIcon } from "lucide-react";
import type { Editor, TLShapeId } from "tldraw";
import { api } from "@/trpc/react";
import {
  ASPECT_RATIOS,
  detectAspectRatio,
  type AspectRatio,
} from "@/lib/utils/image";
import { ApiKeyModal } from "@/components/shared/api-key-modal";
import { AssetGenerationModal } from "./asset-generation-modal";
import { ConfirmGenerationModal } from "./confirm-generation-modal";

const FRAME_DISPLAY_SCALE = 1;

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
  const [newFrameAspectRatio, setNewFrameAspectRatio] =
    useState<AspectRatio>("1:1");

  // Modal states
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [assetModalOpen, setAssetModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmModalData, setConfirmModalData] = useState<{
    previewUrl: string;
    aspectRatio: AspectRatio;
  } | null>(null);

  const { data: hasReplicateKey } = api.user.hasReplicateKey.useQuery();

  // Create a new frame on the canvas
  const handleCreateFrame = () => {
    if (!editor) return;

    const ratio = ASPECT_RATIOS.find((r) => r.value === newFrameAspectRatio);
    if (!ratio) return;

    const displayWidth = ratio.width * FRAME_DISPLAY_SCALE;
    const displayHeight = ratio.height * FRAME_DISPLAY_SCALE;

    const existingFrames = editor
      .getCurrentPageShapes()
      .filter((shape) => shape.type === "frame");

    const overlapsExistingFrame = (x: number, y: number) => {
      const padding = 40;
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

        return (
          newLeft < frameRight &&
          newRight > frameLeft &&
          newTop < frameBottom &&
          newBottom > frameTop
        );
      });
    };

    let x = -displayWidth / 2;
    const y = -displayHeight / 2;
    const stepSize = displayWidth + 60;

    for (let i = 0; i < 50; i++) {
      if (!overlapsExistingFrame(x, y)) break;
      x += stepSize;
    }

    const frameId = `shape:frame-${Date.now()}` as TLShapeId;

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

    editor.select(frameId);
    editor.zoomToSelection({ animation: { duration: 200 } });
  };

  // Export frame as image for preview
  const exportFrameAsImage = useCallback(async () => {
    if (!editor || !selectedFrameId) return null;

    try {
      const shape = editor.getShape(selectedFrameId);
      if (shape?.type !== "frame") return null;

      const bounds = editor.getShapeGeometry(shape).bounds;
      const detectedAspectRatio = detectAspectRatio(bounds.width, bounds.height);

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

  // Handle generate button click
  const handleGenerateClick = async () => {
    if (!prompt.trim() || !editor || !selectedFrameId) return;

    if (!hasReplicateKey) {
      setApiKeyModalOpen(true);
      return;
    }

    const data = await exportFrameAsImage();
    if (data) {
      setConfirmModalData(data);
      setConfirmModalOpen(true);
    }
  };

  // Handle asset button click
  const handleOpenAssetModal = () => {
    if (!hasReplicateKey) {
      setApiKeyModalOpen(true);
      return;
    }
    setAssetModalOpen(true);
  };

  // Handle generation success
  const handleGenerationSuccess = () => {
    setPrompt("");
    if (confirmModalData?.previewUrl) {
      URL.revokeObjectURL(confirmModalData.previewUrl);
    }
    setConfirmModalData(null);
  };

  // Handle confirm modal close
  const handleConfirmModalClose = (open: boolean) => {
    if (!open && confirmModalData?.previewUrl) {
      URL.revokeObjectURL(confirmModalData.previewUrl);
      setConfirmModalData(null);
    }
    setConfirmModalOpen(open);
  };

  // Get current frame info
  const getFrameInfo = () => {
    if (!editor || !selectedFrameId) return null;
    const shape = editor.getShape(selectedFrameId);
    if (shape?.type !== "frame") return null;
    const bounds = editor.getShapeGeometry(shape).bounds;
    const detectedRatio = detectAspectRatio(bounds.width, bounds.height);
    return ASPECT_RATIOS.find((r) => r.value === detectedRatio);
  };

  // Empty state - no frame selected
  if (!selectedFrameId) {
    const selectedRatio = ASPECT_RATIOS.find(
      (r) => r.value === newFrameAspectRatio,
    );

    return (
      <>
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
                Create a frame to get started, or select an existing frame on
                the canvas.
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
                onClick={handleOpenAssetModal}
                variant="outline"
                className="w-full"
              >
                <ImageIcon className="mr-2 h-4 w-4" />
                Generate Asset
              </Button>
            </div>
          </div>
        </div>

        <AssetGenerationModal
          projectId={projectId}
          open={assetModalOpen}
          onOpenChange={setAssetModalOpen}
        />

        <ApiKeyModal
          open={apiKeyModalOpen}
          onOpenChange={setApiKeyModalOpen}
        />
      </>
    );
  }

  // Frame selected state
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

            <Button
              onClick={handleGenerateClick}
              disabled={!prompt.trim()}
              className="w-full"
              size="lg"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Generate
            </Button>
          </div>
        </ScrollArea>
      </div>

      <ConfirmGenerationModal
        projectId={projectId}
        open={confirmModalOpen}
        onOpenChange={handleConfirmModalClose}
        prompt={prompt}
        previewUrl={confirmModalData?.previewUrl ?? null}
        aspectRatio={confirmModalData?.aspectRatio ?? null}
        onSuccess={handleGenerationSuccess}
      />

      <ApiKeyModal
        open={apiKeyModalOpen}
        onOpenChange={setApiKeyModalOpen}
      />
    </>
  );
}
