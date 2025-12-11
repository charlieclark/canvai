"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FolderOpen, Sparkles } from "lucide-react";
import { AssetGenerationModal } from "./asset-generation-modal";
import { CollectionBrowserModal } from "./collection-browser-modal";
import { GenerationOptionsModal } from "@/components/shared/generation-options-modal";
import { api } from "@/trpc/react";
import type { AssetToAdd } from "../page";

interface AddAssetModalProps {
  projectId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddAssetToCanvas: (asset: AssetToAdd) => void;
}

export function AddAssetModal({
  projectId,
  open,
  onOpenChange,
  onAddAssetToCanvas,
}: AddAssetModalProps) {
  const [generationModalOpen, setGenerationModalOpen] = useState(false);
  const [collectionModalOpen, setCollectionModalOpen] = useState(false);
  const [generationOptionsModalOpen, setGenerationOptionsModalOpen] =
    useState(false);

  // Get credits status
  const { data: creditsStatus } = api.generation.getCreditsStatus.useQuery();
  const canGenerate = creditsStatus?.hasCredits || creditsStatus?.hasOwnApiKey;

  const handleOpenGeneration = () => {
    onOpenChange(false);
    if (!canGenerate) {
      setGenerationOptionsModalOpen(true);
      return;
    }
    setGenerationModalOpen(true);
  };

  const handleOpenCollection = () => {
    onOpenChange(false);
    setCollectionModalOpen(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Asset</DialogTitle>
            <DialogDescription>
              Choose how you want to add an asset to your project.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 py-4">
            <button
              onClick={handleOpenCollection}
              className="hover:bg-muted flex flex-col items-center gap-3 rounded-lg border p-6 transition-colors"
            >
              <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
                <FolderOpen className="text-primary h-6 w-6" />
              </div>
              <div className="text-center">
                <p className="font-medium">From Collection</p>
                <p className="text-muted-foreground text-xs">
                  Browse 9,000+ icons
                </p>
              </div>
            </button>

            <button
              onClick={handleOpenGeneration}
              className="hover:bg-muted flex flex-col items-center gap-3 rounded-lg border p-6 transition-colors"
            >
              <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
                <Sparkles className="text-primary h-6 w-6" />
              </div>
              <div className="text-center">
                <p className="font-medium">Generate Asset</p>
                <p className="text-muted-foreground text-xs">
                  AI-powered creation
                </p>
              </div>
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <AssetGenerationModal
        projectId={projectId}
        open={generationModalOpen}
        onOpenChange={setGenerationModalOpen}
      />

      <CollectionBrowserModal
        open={collectionModalOpen}
        onOpenChange={setCollectionModalOpen}
        onAddAssetToCanvas={onAddAssetToCanvas}
      />

      <GenerationOptionsModal
        open={generationOptionsModalOpen}
        onOpenChange={setGenerationOptionsModalOpen}
      />
    </>
  );
}
