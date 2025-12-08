"use client";

import { useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api } from "@/trpc/react";
import { env } from "@/env";

const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

interface StripeCheckoutProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function StripeCheckout({
  open,
  onOpenChange,
  onSuccess,
}: StripeCheckoutProps) {
  const createCheckoutSession = api.billing.createCheckoutSession.useMutation();

  const fetchClientSecret = useCallback(async () => {
    try {
      const { secret } = await createCheckoutSession.mutateAsync();
      if (!secret) throw new Error("Failed to create checkout session");
      return secret;
    } catch (error) {
      console.error("Error creating checkout session:", error);
      onOpenChange(false);
      throw error;
    }
  }, [createCheckoutSession, onOpenChange]);

  const handleComplete = useCallback(() => {
    onSuccess?.();
    onOpenChange(false);
  }, [onSuccess, onOpenChange]);

  const options = { fetchClientSecret, onComplete: handleComplete };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[95vh] overflow-y-auto sm:max-w-[680px]">
        <DialogHeader>
          <DialogTitle>Subscribe to CanvAi</DialogTitle>
          <DialogDescription>
            Get 200 credits per month to generate images without managing your
            own API keys.
          </DialogDescription>
        </DialogHeader>
        <div className="min-h-[600px] py-4">
          <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>
      </DialogContent>
    </Dialog>
  );
}

