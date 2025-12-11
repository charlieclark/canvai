"use client";

import { useState, useCallback, useEffect, useRef } from "react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Sparkles, Frame, Plus, Coins } from "lucide-react";
import type { Editor, TLShapeId } from "tldraw";
import { api } from "@/trpc/react";
import { useToast } from "@/hooks/use-toast";
import {
  ASPECT_RATIOS,
  RESOLUTIONS,
  DEFAULT_RESOLUTION,
  detectAspectRatio,
  detectResolution,
  getGenerationDimensions,
  type AspectRatio,
  type Resolution,
} from "@/lib/utils/image";
import { GenerationOptionsModal } from "@/components/shared/generation-options-modal";
import { ConfirmGenerationModal } from "./confirm-generation-modal";
import {
  STYLE_PRESETS,
  ACTION_PRESETS,
  ENHANCEMENT_FILTERS,
  DEFAULT_ACTION_ID,
  buildEnhancedPrompt,
} from "@/config/generation-presets";
import { cn } from "@/lib/utils";
import Image from "next/image";

const FRAME_DISPLAY_SCALE = 1;

interface GeneratePanelProps {
  projectId: string;
  editor: Editor | null;
  selectedFrameId: TLShapeId | null;
  onAddFrame: () => void;
}

export function GeneratePanel({
  projectId,
  editor,
  selectedFrameId,
  onAddFrame,
}: GeneratePanelProps) {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState("");
  const [newFrameAspectRatio, setNewFrameAspectRatio] =
    useState<AspectRatio>("1:1");
  const [resolution, setResolution] = useState<Resolution>(DEFAULT_RESOLUTION);

  // Generation preset states
  const [selectedStyles, setSelectedStyles] = useState<string[]>(["auto"]);
  const [selectedAction, setSelectedAction] = useState<string | null>(
    DEFAULT_ACTION_ID,
  );
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  // Modal states
  const [generationOptionsModalOpen, setGenerationOptionsModalOpen] =
    useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmModalData, setConfirmModalData] = useState<{
    previewUrl: string;
    aspectRatio: AspectRatio;
    resolution: Resolution;
  } | null>(null);

  // Frame preview state
  const [framePreviewUrl, setFramePreviewUrl] = useState<string | null>(null);
  const framePreviewUrlRef = useRef<string | null>(null);
  const previewTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Get credits status (includes subscription info and API key status)
  const { data: creditsStatus } = api.generation.getCreditsStatus.useQuery();

  // User can generate if they have credits OR their own API key
  const canGenerate = creditsStatus?.hasCredits || creditsStatus?.hasOwnApiKey;

  // Update frame preview when frame or its contents change
  const updateFramePreview = useCallback(async () => {
    if (!editor || !selectedFrameId) {
      if (framePreviewUrlRef.current) {
        URL.revokeObjectURL(framePreviewUrlRef.current);
        framePreviewUrlRef.current = null;
      }
      setFramePreviewUrl(null);
      return;
    }

    try {
      const shape = editor.getShape(selectedFrameId);
      if (shape?.type !== "frame") return;

      const { blob } = await editor.toImage([selectedFrameId], {
        format: "png",
        background: true,
        quality: 80,
        scale: 0.5, // Lower scale for preview to improve performance
      });

      // Revoke previous URL to prevent memory leaks
      if (framePreviewUrlRef.current) {
        URL.revokeObjectURL(framePreviewUrlRef.current);
      }

      const url = URL.createObjectURL(blob);
      framePreviewUrlRef.current = url;
      setFramePreviewUrl(url);
    } catch (error) {
      console.error("Failed to update frame preview:", error);
    }
  }, [editor, selectedFrameId]);

  // Listen for editor changes and update preview (debounced)
  useEffect(() => {
    if (!editor || !selectedFrameId) {
      if (framePreviewUrlRef.current) {
        URL.revokeObjectURL(framePreviewUrlRef.current);
        framePreviewUrlRef.current = null;
      }
      setFramePreviewUrl(null);
      return;
    }

    // Initial preview
    void updateFramePreview();

    // Listen for store changes and update preview with debounce
    const removeListener = editor.store.listen(
      () => {
        // Clear existing timeout
        if (previewTimeoutRef.current) {
          clearTimeout(previewTimeoutRef.current);
        }
        // Debounce preview updates to avoid excessive rendering
        previewTimeoutRef.current = setTimeout(() => {
          void updateFramePreview();
        }, 300);
      },
      { source: "user", scope: "document" },
    ) as () => void;

    return () => {
      removeListener();
      if (previewTimeoutRef.current) {
        clearTimeout(previewTimeoutRef.current);
      }
    };
  }, [editor, selectedFrameId, updateFramePreview]);

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (framePreviewUrlRef.current) {
        URL.revokeObjectURL(framePreviewUrlRef.current);
      }
      if (previewTimeoutRef.current) {
        clearTimeout(previewTimeoutRef.current);
      }
    };
  }, []);

  // Toggle style selection
  const toggleStyle = (styleId: string) => {
    setSelectedStyles((prev) =>
      prev.includes(styleId)
        ? prev.filter((id) => id !== styleId)
        : [...prev, styleId],
    );
  };

  // Toggle filter selection
  const toggleFilter = (filterId: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filterId)
        ? prev.filter((id) => id !== filterId)
        : [...prev, filterId],
    );
  };

  // Create a new frame on the canvas
  const handleCreateFrame = () => {
    if (!editor) return;

    const ratio = ASPECT_RATIOS.find((r) => r.value === newFrameAspectRatio);
    if (!ratio) return;

    // Use resolution-based dimensions for the frame
    const dimensions = getGenerationDimensions(newFrameAspectRatio, resolution);
    const displayWidth = dimensions.width * FRAME_DISPLAY_SCALE;
    const displayHeight = dimensions.height * FRAME_DISPLAY_SCALE;

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

    const resolutionLabel = resolution === 2 ? "2K" : "1K";
    editor.createShape({
      id: frameId,
      type: "frame",
      x,
      y,
      props: {
        w: displayWidth,
        h: displayHeight,
        name: `${ratio.label} - ${resolutionLabel}`,
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
      const detectedAspectRatio = detectAspectRatio(
        bounds.width,
        bounds.height,
      );
      const detectedRes = detectResolution(
        bounds.width,
        bounds.height,
        detectedAspectRatio,
      );

      const { blob } = await editor.toImage([selectedFrameId], {
        format: "jpeg",
        background: true,
        quality: 100,
      });

      const url = URL.createObjectURL(blob);
      return {
        previewUrl: url,
        aspectRatio: detectedAspectRatio,
        resolution: detectedRes,
      };
    } catch (error) {
      console.error("Failed to export frame:", error);
      return null;
    }
  }, [editor, selectedFrameId]);

  // Build enhanced prompt with all selected options
  const getEnhancedPrompt = () => {
    return buildEnhancedPrompt({
      userPrompt: prompt,
      selectedAction,
      selectedStyles,
      selectedFilters,
    });
  };

  // Handle generate button click
  const handleGenerateClick = async () => {
    if (!editor || !selectedFrameId) return;

    // Check if frame has any content
    const childIds = editor.getSortedChildIdsForParent(selectedFrameId);
    if (childIds.length === 0) {
      toast({
        title: "Empty frame",
        description:
          "Add some content to the frame before generating. Draw, add images, or paste elements into the frame.",
        variant: "destructive",
      });
      return;
    }

    if (!canGenerate) {
      setGenerationOptionsModalOpen(true);
      return;
    }

    const data = await exportFrameAsImage();
    if (data) {
      setConfirmModalData(data);
      setConfirmModalOpen(true);
    }
  };

  // Handle generation success
  const handleGenerationSuccess = () => {
    setPrompt("");
    setSelectedStyles([]);
    setSelectedAction(DEFAULT_ACTION_ID);
    setSelectedFilters([]);
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

  // Get current frame info including detected resolution
  const getFrameInfo = () => {
    if (!editor || !selectedFrameId) return null;
    const shape = editor.getShape(selectedFrameId);
    if (shape?.type !== "frame") return null;
    const bounds = editor.getShapeGeometry(shape).bounds;
    const detectedRatio = detectAspectRatio(bounds.width, bounds.height);
    const detectedRes = detectResolution(
      bounds.width,
      bounds.height,
      detectedRatio,
    );
    const aspectRatioInfo = ASPECT_RATIOS.find(
      (r) => r.value === detectedRatio,
    );
    if (!aspectRatioInfo) return null;
    return {
      ...aspectRatioInfo,
      resolution: detectedRes,
      outputWidth: getGenerationDimensions(detectedRatio, detectedRes).width,
      outputHeight: getGenerationDimensions(detectedRatio, detectedRes).height,
    };
  };

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

  // Style selector component
  const StyleSelector = () => {
    return (
      <div className="space-y-2">
        <div className="flex items-baseline gap-2">
          <Label className="text-xs font-medium">Style</Label>
          <span className="text-muted-foreground text-[10px]">Optional</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <TooltipProvider delayDuration={300}>
            {STYLE_PRESETS.map((style) => {
              const isSelected = selectedStyles.includes(style.id);
              return (
                <Tooltip key={style.id}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => toggleStyle(style.id)}
                      className={cn(
                        "rounded-full px-2 py-1 text-[11px] font-medium transition-all",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-muted/80 text-foreground",
                      )}
                    >
                      {style.label}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>{style.description}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </TooltipProvider>
        </div>
      </div>
    );
  };

  // Action selector component
  const ActionSelector = () => {
    return (
      <div className="space-y-2">
        <Label className="text-xs font-medium">Action</Label>
        <div className="flex flex-wrap gap-1.5">
          <TooltipProvider delayDuration={300}>
            {ACTION_PRESETS.map((action) => {
              const isSelected = selectedAction === action.id;
              return (
                <Tooltip key={action.id}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() =>
                        setSelectedAction(isSelected ? null : action.id)
                      }
                      className={cn(
                        "rounded-full px-2 py-1 text-[11px] font-medium transition-all",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-muted/80 text-foreground",
                      )}
                    >
                      {action.label}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>{action.description}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </TooltipProvider>
        </div>
      </div>
    );
  };

  // Enhancement filters component
  const EnhancementFilters = () => {
    return (
      <div className="space-y-2">
        <div className="flex items-baseline gap-2">
          <Label className="text-xs font-medium">Enhancements</Label>
          <span className="text-muted-foreground text-[10px]">Optional</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <TooltipProvider delayDuration={300}>
            {ENHANCEMENT_FILTERS.map((filter) => {
              const isSelected = selectedFilters.includes(filter.id);
              return (
                <Tooltip key={filter.id}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => toggleFilter(filter.id)}
                      className={cn(
                        "rounded-full px-2 py-1 text-[11px] font-medium transition-all",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-muted/80 text-foreground",
                      )}
                    >
                      {filter.label}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>{filter.description}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </TooltipProvider>
        </div>
      </div>
    );
  };

  // Empty state - no frame selected
  if (!selectedFrameId) {
    const selectedRatio = ASPECT_RATIOS.find(
      (r) => r.value === newFrameAspectRatio,
    );

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
                Create a frame to get started, or select an existing frame on
                the canvas.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-frame-aspect-ratio">Frame Size</Label>
                <Select
                  value={newFrameAspectRatio}
                  onValueChange={(v) =>
                    setNewFrameAspectRatio(v as AspectRatio)
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
                  onValueChange={(v) => setResolution(Number(v) as Resolution)}
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

        <GenerationOptionsModal
          open={generationOptionsModalOpen}
          onOpenChange={setGenerationOptionsModalOpen}
        />
      </>
    );
  }

  // Frame selected state
  const frameInfo = getFrameInfo();

  return (
    <>
      <div className="bg-muted/30 flex h-full w-80 flex-col border-l">
        <div className="space-y-2 border-b p-4">
          <div>
            <h2 className="font-semibold">Generate</h2>
            {frameInfo && (
              <p className="text-muted-foreground text-xs">
                {frameInfo.label} • {frameInfo.resolution === 2 ? "2K" : "1K"} (
                {frameInfo.outputWidth}×{frameInfo.outputHeight})
              </p>
            )}
          </div>
          <CreditsDisplay />
        </div>

        <ScrollArea className="flex-1">
          <div className="space-y-5 p-4">
            {/* Frame Preview */}
            <div className="space-y-2">
              <Label className="text-xs font-medium">Frame Preview</Label>
              <div className="bg-muted border-primary/50 relative aspect-video overflow-hidden rounded-lg border-2">
                {framePreviewUrl ? (
                  <Image
                    src={framePreviewUrl}
                    alt="Frame preview"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <div className="text-muted-foreground text-xs">
                      Loading preview...
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Prompt input */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <Label htmlFor="prompt">Prompt</Label>
                <span className="text-muted-foreground text-xs">Optional</span>
              </div>
              <Textarea
                id="prompt"
                placeholder="Add extra details or leave empty for automatic transformation..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>

            {/* Action presets */}
            <ActionSelector />

            {/* Style presets */}
            <StyleSelector />

            {/* Enhancement filters */}
            <EnhancementFilters />
          </div>
        </ScrollArea>

        {/* Sticky generate button */}
        <div className="space-y-2 border-t p-4">
          <Button onClick={handleGenerateClick} className="w-full" size="lg">
            <Sparkles className="mr-2 h-4 w-4" />
            Generate
          </Button>
          <Button
            variant="outline"
            onClick={() => onAddFrame()}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Frame
          </Button>
        </div>
      </div>

      <ConfirmGenerationModal
        projectId={projectId}
        open={confirmModalOpen}
        onOpenChange={handleConfirmModalClose}
        prompt={getEnhancedPrompt()}
        selections={{
          userPrompt: prompt,
          selectedAction,
          selectedStyles,
          selectedFilters,
        }}
        previewUrl={confirmModalData?.previewUrl ?? null}
        aspectRatio={confirmModalData?.aspectRatio ?? null}
        resolution={confirmModalData?.resolution ?? DEFAULT_RESOLUTION}
        onSuccess={handleGenerationSuccess}
      />

      <GenerationOptionsModal
        open={generationOptionsModalOpen}
        onOpenChange={setGenerationOptionsModalOpen}
      />
    </>
  );
}
