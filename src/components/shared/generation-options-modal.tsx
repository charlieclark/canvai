"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Key, Sparkles, Check, ArrowRight, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ApiKeyModal } from "./api-key-modal";

interface GenerationOptionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function GenerationOptionsModal({
  open,
  onOpenChange,
  onSuccess,
}: GenerationOptionsModalProps) {
  const { toast } = useToast();
  const [view, setView] = useState<"choice" | "subscribed">("choice");
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);

  const markInterestMutation = api.user.markSubscriptionInterest.useMutation({
    onSuccess: () => {
      setView("subscribed");
    },
    onError: (error) => {
      toast({
        title: "Something went wrong",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubscribeClick = () => {
    markInterestMutation.mutate();
  };

  const handleUseOwnKey = () => {
    onOpenChange(false);
    setApiKeyModalOpen(true);
  };

  const handleClose = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset view when closing
      setTimeout(() => setView("choice"), 200);
    }
    onOpenChange(newOpen);
  };

  const handleApiKeySuccess = () => {
    onSuccess?.();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-lg">
          {view === "choice" ? (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Start Generating
                </DialogTitle>
                <DialogDescription>
                  Choose how you&apos;d like to power your image generations.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                {/* Subscribe Option */}
                <button
                  onClick={handleSubscribeClick}
                  disabled={markInterestMutation.isPending}
                  className="group relative rounded-xl border-2 border-gray-200 bg-white p-5 text-left transition-all hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600 dark:hover:bg-gray-800"
                >
                  <div className="mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                      {markInterestMutation.isPending ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Sparkles className="h-5 w-5" />
                      )}
                    </div>
                  </div>
                  <h3 className="mb-1 font-semibold text-gray-900 dark:text-gray-100">
                    Subscribe to CanvAi
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Simple monthly pricing, no setup required. Just start
                    generating.
                  </p>
                  <ArrowRight className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                </button>

                {/* BYOK Option */}
                <button
                  onClick={handleUseOwnKey}
                  className="group relative rounded-xl border-2 border-gray-200 bg-white p-5 text-left transition-all hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600 dark:hover:bg-gray-800"
                >
                  <div className="mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                      <Key className="h-5 w-5" />
                    </div>
                  </div>
                  <h3 className="mb-1 font-semibold text-gray-900 dark:text-gray-100">
                    Use Your Own API Key
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Connect your Replicate account and pay only for what you
                    use.
                  </p>
                  <ArrowRight className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                </button>
              </div>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400">
                    <Check className="h-5 w-5" />
                  </div>
                  Thanks for your interest!
                </DialogTitle>
                <DialogDescription className="pt-2">
                  We&apos;ve noted that you&apos;re interested in a subscription
                  plan. We&apos;ll notify you as soon as it&apos;s available!
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950">
                  <h4 className="mb-1 font-medium text-amber-900 dark:text-amber-100">
                    In the meantime...
                  </h4>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    You can start generating images right away using your own
                    Replicate API key. Replicate offers pay-per-use pricing with
                    no minimum commitments.
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => handleClose(false)}
                    className="flex-1"
                  >
                    Maybe Later
                  </Button>
                  <Button onClick={handleUseOwnKey} className="flex-1">
                    <Key className="mr-2 h-4 w-4" />
                    Set Up Replicate
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <ApiKeyModal
        open={apiKeyModalOpen}
        onOpenChange={setApiKeyModalOpen}
        onSuccess={handleApiKeySuccess}
      />
    </>
  );
}

