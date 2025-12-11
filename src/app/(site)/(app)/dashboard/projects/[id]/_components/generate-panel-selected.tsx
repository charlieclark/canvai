"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Sparkles, Plus, Coins, Focus } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GenerationOptionsModal } from "@/components/shared/generation-options-modal";
import { ConfirmGenerationModal } from "./confirm-generation-modal";
import {
  STYLE_PRESETS,
  ACTION_PRESETS,
  COMPOSITION_PRESETS,
  ENHANCEMENT_FILTERS,
  DEFAULT_ACTION_ID,
  DEFAULT_COMPOSITION_ID,
  buildEnhancedPrompt,
} from "@/config/generation-presets";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface GeneratePanelSelectedProps {
  projectId: string;
  editor: Editor;
  generateFrameId: TLShapeId;
  onAddFrame: () => void;
}

export function GeneratePanelSelected({
  projectId,
  editor,
  generateFrameId,
  onAddFrame,
}: GeneratePanelSelectedProps) {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState("");

  // Generation preset states
  const [selectedStyle, setSelectedStyle] = useState<string | null>("auto");
  const [selectedAction, setSelectedAction] = useState<string | null>(
    DEFAULT_ACTION_ID,
  );
  const [selectedComposition, setSelectedComposition] = useState<string | null>(
    DEFAULT_COMPOSITION_ID,
  );
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  // Frame dimension states - initialized from detected values
  const [frameAspectRatio, setFrameAspectRatio] = useState<AspectRatio | null>(
    null,
  );
  const [frameResolution, setFrameResolution] = useState<Resolution | null>(
    null,
  );

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
    try {
      const shape = editor.getShape(generateFrameId);
      if (shape?.type !== "frame") return;

      const { blob } = await editor.toImage([generateFrameId], {
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
  }, [editor, generateFrameId]);

  // Listen for editor changes and update preview (debounced)
  useEffect(() => {
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
  }, [editor, generateFrameId, updateFramePreview]);

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

  // Initialize frame dimensions from current frame
  useEffect(() => {
    const shape = editor.getShape(generateFrameId);
    if (shape?.type !== "frame") return;
    const bounds = editor.getShapeGeometry(shape).bounds;
    const detectedRatio = detectAspectRatio(bounds.width, bounds.height);
    const detectedRes = detectResolution(
      bounds.width,
      bounds.height,
      detectedRatio,
    );
    setFrameAspectRatio(detectedRatio);
    setFrameResolution(detectedRes);
  }, [editor, generateFrameId]);

  // Center the frame in the viewport
  const centerFrame = useCallback(() => {
    const shape = editor.getShape(generateFrameId);
    if (!shape) return;
    const bounds = editor.getShapePageBounds(shape);
    if (!bounds) return;
    editor.zoomToBounds(bounds, { animation: { duration: 200 } });
  }, [editor, generateFrameId]);

  // Resize frame when aspect ratio or resolution changes
  const resizeFrame = useCallback(
    (newAspectRatio: AspectRatio, newResolution: Resolution) => {
      const shape = editor.getShape(generateFrameId);
      if (shape?.type !== "frame") return;

      const dimensions = getGenerationDimensions(newAspectRatio, newResolution);
      const ratioInfo = ASPECT_RATIOS.find((r) => r.value === newAspectRatio);
      const resolutionLabel = newResolution === 2 ? "2K" : "1K";

      editor.updateShape({
        id: generateFrameId,
        type: "frame",
        props: {
          w: dimensions.width,
          h: dimensions.height,
          name: `${ratioInfo?.label ?? newAspectRatio} - ${resolutionLabel}`,
        },
      });

      // Center the frame after resizing
      // Small delay to ensure the shape update is complete
      setTimeout(() => {
        const updatedShape = editor.getShape(generateFrameId);
        if (!updatedShape) return;
        const bounds = editor.getShapePageBounds(updatedShape);
        if (!bounds) return;
        editor.zoomToBounds(bounds, { animation: { duration: 200 } });
      }, 50);
    },
    [editor, generateFrameId],
  );

  // Handle aspect ratio change
  const handleAspectRatioChange = (value: AspectRatio) => {
    setFrameAspectRatio(value);
    if (frameResolution) {
      resizeFrame(value, frameResolution);
    }
  };

  // Handle resolution change
  const handleResolutionChange = (value: Resolution) => {
    setFrameResolution(value);
    if (frameAspectRatio) {
      resizeFrame(frameAspectRatio, value);
    }
  };

  // Handle style selection (single select)
  const handleStyleSelect = (styleId: string) => {
    setSelectedStyle((prev) => (prev === styleId ? null : styleId));
  };

  // Toggle filter selection
  const toggleFilter = (filterId: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filterId)
        ? prev.filter((id) => id !== filterId)
        : [...prev, filterId],
    );
  };

  // Handle action selection
  const handleActionSelect = (actionId: string) => {
    setSelectedAction((prev) => (prev === actionId ? null : actionId));
  };

  // Handle composition selection
  const handleCompositionSelect = (compositionId: string) => {
    setSelectedComposition((prev) =>
      prev === compositionId ? null : compositionId,
    );
  };

  // Handle prompt change
  const handlePromptChange = (value: string) => {
    setPrompt(value);
  };

  // Export frame as image for preview
  const exportFrameAsImage = useCallback(async () => {
    try {
      const shape = editor.getShape(generateFrameId);
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

      const { blob } = await editor.toImage([generateFrameId], {
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
  }, [editor, generateFrameId]);

  // Build enhanced prompt with all selected options
  const getEnhancedPrompt = () => {
    return buildEnhancedPrompt({
      userPrompt: prompt,
      selectedAction,
      selectedComposition,
      selectedStyle,
      selectedFilters,
    });
  };

  // Handle generate button click
  const handleGenerateClick = async () => {
    // Check if frame has any content
    const childIds = editor.getSortedChildIdsForParent(generateFrameId);
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
    setSelectedStyle(null);
    setSelectedAction(DEFAULT_ACTION_ID);
    setSelectedComposition(DEFAULT_COMPOSITION_ID);
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

  // Get current frame info from selected values
  const getFrameInfo = () => {
    if (!frameAspectRatio || !frameResolution) return null;
    const aspectRatioInfo = ASPECT_RATIOS.find(
      (r) => r.value === frameAspectRatio,
    );
    if (!aspectRatioInfo) return null;
    return {
      ...aspectRatioInfo,
      resolution: frameResolution,
      outputWidth: getGenerationDimensions(frameAspectRatio, frameResolution)
        .width,
      outputHeight: getGenerationDimensions(frameAspectRatio, frameResolution)
        .height,
    };
  };

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
        </div>

        <ScrollArea className="flex-1">
          <div className="space-y-5 p-4">
            {/* Frame Preview */}
            <div className="space-y-2">
              <Label className="text-xs font-medium">Frame Preview</Label>
              <div className="bg-muted border-primary/50 relative aspect-2/1 overflow-hidden rounded-lg border-2">
                {framePreviewUrl ? (
                  <Image
                    src={framePreviewUrl}
                    alt="Frame preview"
                    fill
                    className="h-full w-full object-contain"
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

            {/* Frame Size Controls */}
            <div className="flex items-end gap-2">
              <div className="flex-1 space-y-1.5">
                <Label htmlFor="frame-aspect-ratio" className="text-xs">
                  Aspect Ratio
                </Label>
                <Select
                  value={frameAspectRatio ?? undefined}
                  onValueChange={(v) =>
                    handleAspectRatioChange(v as AspectRatio)
                  }
                >
                  <SelectTrigger
                    id="frame-aspect-ratio"
                    className="h-8 text-xs"
                  >
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
              <div className="flex-1 space-y-1.5">
                <Label htmlFor="frame-resolution" className="text-xs">
                  Resolution
                </Label>
                <Select
                  value={frameResolution ? String(frameResolution) : undefined}
                  onValueChange={(v) =>
                    handleResolutionChange(Number(v) as Resolution)
                  }
                >
                  <SelectTrigger id="frame-resolution" className="h-8 text-xs">
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
              </div>
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={centerFrame}
                      className="h-8 w-8 shrink-0"
                    >
                      <Focus className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Center frame in view</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Action presets */}
            <div className="space-y-2">
              <Label className="text-xs font-medium">Action</Label>
              <div className="flex flex-wrap gap-1.5">
                <TooltipProvider delayDuration={300}>
                  {ACTION_PRESETS.map((action) => (
                    <Tooltip key={action.id}>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => handleActionSelect(action.id)}
                          className={cn(
                            "rounded-full px-2 py-1 text-[11px] font-medium transition-all",
                            selectedAction === action.id
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
                  ))}
                </TooltipProvider>
              </div>
            </div>

            {/* Composition presets */}
            <div className="space-y-2">
              <Label className="text-xs font-medium">Composition</Label>
              <div className="flex flex-wrap gap-1.5">
                <TooltipProvider delayDuration={300}>
                  {COMPOSITION_PRESETS.map((composition) => (
                    <Tooltip key={composition.id}>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() =>
                            handleCompositionSelect(composition.id)
                          }
                          className={cn(
                            "rounded-full px-2 py-1 text-[11px] font-medium transition-all",
                            selectedComposition === composition.id
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted hover:bg-muted/80 text-foreground",
                          )}
                        >
                          {composition.label}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>{composition.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </TooltipProvider>
              </div>
            </div>

            {/* Style presets */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <Label className="text-xs font-medium">Style</Label>
                <span className="text-muted-foreground text-[10px]">
                  Optional
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <TooltipProvider delayDuration={300}>
                  {STYLE_PRESETS.map((style) => (
                    <Tooltip key={style.id}>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => handleStyleSelect(style.id)}
                          className={cn(
                            "rounded-full px-2 py-1 text-[11px] font-medium transition-all",
                            selectedStyle === style.id
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
                  ))}
                </TooltipProvider>
              </div>
            </div>

            {/* Enhancement filters */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <Label className="text-xs font-medium">Enhancements</Label>
                <span className="text-muted-foreground text-[10px]">
                  Optional
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <TooltipProvider delayDuration={300}>
                  {ENHANCEMENT_FILTERS.map((filter) => (
                    <Tooltip key={filter.id}>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => toggleFilter(filter.id)}
                          className={cn(
                            "rounded-full px-2 py-1 text-[11px] font-medium transition-all",
                            selectedFilters.includes(filter.id)
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
                  ))}
                </TooltipProvider>
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
                onChange={(e) => handlePromptChange(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>
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
          selectedComposition,
          selectedStyle,
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
