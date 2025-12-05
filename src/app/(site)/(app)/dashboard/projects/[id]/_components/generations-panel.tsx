"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Download, Plus, Loader2, ImageIcon } from "lucide-react";
import type { Editor, TLAssetId } from "tldraw";
import type { Generation } from "@prisma/client";
import Image from "next/image";

interface GenerationsPanelProps {
  projectId: string;
  editor: Editor | null;
  generations: Generation[];
}

export function GenerationsPanel({
  projectId: _projectId,
  editor,
  generations,
}: GenerationsPanelProps) {
  const handleAddToCanvas = (generation: Generation) => {
    if (!editor || !generation.imageUrl) return;

    // Create an image asset and shape on the canvas
    const assetId = `asset:${generation.id}` as TLAssetId;

    // Check if asset already exists
    const existingAsset = editor.getAsset(assetId);
    if (!existingAsset) {
      editor.createAssets([
        {
          id: assetId,
          type: "image",
          typeName: "asset",
          props: {
            name: `Generation ${generation.id}`,
            src: generation.imageUrl,
            w: generation.width,
            h: generation.height,
            mimeType: "image/webp",
            isAnimated: false,
          },
          meta: {},
        },
      ]);
    }

    // Create image shape at center of viewport
    const viewportCenter = editor.getViewportScreenCenter();
    const pagePoint = editor.screenToPage(viewportCenter);

    editor.createShape({
      type: "image",
      x: pagePoint.x - generation.width / 2,
      y: pagePoint.y - generation.height / 2,
      props: {
        assetId: assetId,
        w: generation.width,
        h: generation.height,
      },
    });
  };

  const handleDownload = async (generation: Generation) => {
    if (!generation.imageUrl) return;

    try {
      const response = await fetch(generation.imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `generation-${generation.id}.webp`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Failed to download:", error);
    }
  };

  const completedGenerations = generations.filter(
    (g) => g.status === "COMPLETED" && g.imageUrl,
  );
  const pendingGenerations = generations.filter(
    (g) => g.status === "PENDING" || g.status === "PROCESSING",
  );

  return (
    <div className="bg-muted/30 flex h-full w-64 flex-col border-r">
      <div className="border-b p-4">
        <h2 className="font-semibold">Generations</h2>
        <p className="text-muted-foreground text-xs">
          {completedGenerations.length} images
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-3 p-4">
          {/* Pending generations */}
          {pendingGenerations.map((generation) => (
            <div
              key={generation.id}
              className="bg-muted animate-pulse rounded-lg p-4"
            >
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-muted-foreground text-sm">
                  Generating...
                </span>
              </div>
            </div>
          ))}

          {/* Completed generations */}
          {completedGenerations.map((generation) => (
            <div
              key={generation.id}
              className="bg-background group relative overflow-hidden rounded-lg border"
            >
              <div className="relative aspect-square">
                {generation.imageUrl ? (
                  <Image
                    src={generation.imageUrl}
                    alt={generation.prompt}
                    fill
                    className="object-cover"
                    sizes="256px"
                  />
                ) : (
                  <div className="bg-muted flex h-full items-center justify-center">
                    <ImageIcon className="text-muted-foreground h-8 w-8" />
                  </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => handleAddToCanvas(generation)}
                    title="Add to canvas"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => handleDownload(generation)}
                    title="Download"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Prompt preview */}
              <div className="p-2">
                <p className="text-muted-foreground line-clamp-2 text-xs">
                  {generation.prompt}
                </p>
              </div>
            </div>
          ))}

          {/* Empty state */}
          {generations.length === 0 && (
            <div className="text-muted-foreground py-8 text-center text-sm">
              <ImageIcon className="mx-auto mb-2 h-8 w-8 opacity-50" />
              <p>No generations yet</p>
              <p className="mt-1 text-xs">
                Select a frame and generate your first image
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

