"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { StripeCheckout } from "./stripe-checkout";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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
  const [stripeCheckoutOpen, setStripeCheckoutOpen] = useState(false);

  const handleSubscribeClick = () => {
    onOpenChange(false);
    setStripeCheckoutOpen(true);
  };

  const handleStripeSuccess = () => {
    onSuccess?.();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Upgrade to CanvAi Pro
            </DialogTitle>
            <DialogDescription>
              Subscribe to start generating AI images with CanvAi.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="rounded-lg border bg-gradient-to-br from-violet-50 to-fuchsia-50 p-6 dark:from-violet-950/50 dark:to-fuchsia-950/50">
              <div className="mb-4">
                <span className="text-3xl font-bold">$20</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-violet-500" />
                  <span>200 image generation credits per month</span>
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-violet-500" />
                  <span>Access to all AI models</span>
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-violet-500" />
                  <span>Cancel anytime</span>
                </li>
              </ul>
            </div>

            <Button
              size="lg"
              className="mt-4 w-full"
              onClick={handleSubscribeClick}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Subscribe Now
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <StripeCheckout
        open={stripeCheckoutOpen}
        onOpenChange={setStripeCheckoutOpen}
        onSuccess={handleStripeSuccess}
      />
    </>
  );
}
