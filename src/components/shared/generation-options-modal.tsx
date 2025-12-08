"use client";

import { useState } from "react";
import { Key, Sparkles, ArrowRight } from "lucide-react";
import { ApiKeyModal } from "./api-key-modal";
import { StripeCheckout } from "./stripe-checkout";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [stripeCheckoutOpen, setStripeCheckoutOpen] = useState(false);

  const handleSubscribeClick = () => {
    onOpenChange(false);
    setStripeCheckoutOpen(true);
  };

  const handleUseOwnKey = () => {
    onOpenChange(false);
    setApiKeyModalOpen(true);
  };

  const handleApiKeySuccess = () => {
    onSuccess?.();
  };

  const handleStripeSuccess = () => {
    onSuccess?.();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
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
              className="group relative rounded-xl border-2 border-gray-200 bg-white p-5 text-left transition-all hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600 dark:hover:bg-gray-800"
            >
              <div className="mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                  <Sparkles className="h-5 w-5" />
                </div>
              </div>
              <h3 className="mb-1 font-semibold text-gray-900 dark:text-gray-100">
                Subscribe to CanvAi
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                $20/month for 200 credits. No setup required, just start
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
                Connect your Replicate account and pay only for what you use.
              </p>
              <ArrowRight className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <ApiKeyModal
        open={apiKeyModalOpen}
        onOpenChange={setApiKeyModalOpen}
        onSuccess={handleApiKeySuccess}
      />

      <StripeCheckout
        open={stripeCheckoutOpen}
        onOpenChange={setStripeCheckoutOpen}
        onSuccess={handleStripeSuccess}
      />
    </>
  );
}
