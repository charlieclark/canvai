"use client";

import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Download, Plus, Loader2, ImageIcon, Trash2 } from "lucide-react";
import type { Generation } from "@prisma/client";
import Image from "next/image";
import { api } from "@/trpc/react";
import { useToast } from "@/hooks/use-toast";
import { AddAssetModal } from "./add-asset-modal";
import type { AssetToAdd } from "../page";

/**
 * Component that polls a single pending generation until complete
 */
function PendingGeneration({
  generation,
  projectId,
}: {
  generation: Generation;
  projectId: string;
}) {
  const utils = api.useUtils();

  const { data } = api.generation.getStatus.useQuery(
    { generationId: generation.id },
    {
      // Poll every 2 seconds while still pending
      refetchInterval: (query) => {
        const status = query.state.data?.status;
        if (status === "COMPLETED" || status === "FAILED") {
          return false;
        }
        return 2000;
      },
    },
  );

  // When status changes to completed/failed, invalidate the list
  useEffect(() => {
    if (data?.status === "COMPLETED" || data?.status === "FAILED") {
      void utils.generation.list.invalidate({ projectId });
    }
  }, [data?.status, projectId, utils]);

  return (
    <div className="bg-muted animate-pulse rounded-lg p-4">
      <div className="flex aspect-square items-center justify-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-muted-foreground text-sm">Generating...</span>
      </div>
    </div>
  );
}

interface GenerationsPanelProps {
  projectId: string;
  onAddAssetToCanvas: (asset: AssetToAdd) => void;
  onAddFrameWithGeneration: (generation: Generation) => void;
}

export function GenerationsPanel({
  projectId,
  onAddAssetToCanvas,
  onAddFrameWithGeneration,
}: GenerationsPanelProps) {
  const { toast } = useToast();
  const utils = api.useUtils();

  // Modal state
  const [assetModalOpen, setAssetModalOpen] = useState(false);

  const handleOpenAssetModal = () => {
    setAssetModalOpen(true);
  };

  const { data: generations = [] } = api.generation.list.useQuery(
    { projectId },
    { enabled: !!projectId },
  );

  const pendingGenerations = generations.filter(
    (g) => g.status === "PENDING" || g.status === "PROCESSING",
  );

  const deleteGeneration = api.generation.delete.useMutation({
    onSuccess: () => {
      void utils.generation.list.invalidate({ projectId });
      toast({
        title: "Generation deleted",
        description: "The generation has been removed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDelete = (generation: Generation) => {
    if (deleteGeneration.isPending) return;
    deleteGeneration.mutate({ generationId: generation.id });
  };

  const handleAddToCanvas = (generation: Generation) => {
    if (!generation.imageUrl) return;

    if (generation.type === "ASSET") {
      onAddAssetToCanvas({
        id: generation.id,
        name: `Generation ${generation.id}`,
        src: generation.imageUrl,
        width: generation.width,
        height: generation.height,
        mimeType: "image/jpg",
      });
    } else if (generation.type === "FRAME") {
      onAddFrameWithGeneration(generation);
    }
  };

  const handleDownload = async (generation: Generation) => {
    if (!generation.imageUrl) return;

    try {
      window.open(generation.imageUrl + "?download=1");
    } catch (error) {
      console.error("Failed to download:", error);
    }
  };

  const completedGenerations = generations.filter(
    (g) => g.status === "COMPLETED" || g.status === "FAILED",
  );

  return (
    <>
      <div className="bg-muted/30 flex h-full w-64 flex-col border-r">
        <div className="space-y-3 border-b p-4">
          <div>
            <h2 className="font-semibold">Generations</h2>
            <p className="text-muted-foreground text-xs">
              {completedGenerations.length} images
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleOpenAssetModal}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Asset
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="space-y-3 p-4">
            {/* Pending generations - each polls its own status */}
            {pendingGenerations.map((generation) => (
              <PendingGeneration
                key={generation.id}
                generation={generation}
                projectId={projectId}
              />
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
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => handleDelete(generation)}
                      disabled={deleteGeneration.isPending}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Prompt preview */}
                {/* <div className="p-2">
                <p className="text-muted-foreground line-clamp-2 text-xs">
                  {generation.prompt}
                </p>
              </div> */}
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

      <AddAssetModal
        projectId={projectId}
        open={assetModalOpen}
        onOpenChange={setAssetModalOpen}
        onAddAssetToCanvas={onAddAssetToCanvas}
      />
    </>
  );
}
