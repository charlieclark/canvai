"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreditCard, ExternalLink } from "lucide-react";

interface InsufficientCreditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InsufficientCreditModal({
  open,
  onOpenChange,
}: InsufficientCreditModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-amber-500" />
            Insufficient Replicate Credit
          </DialogTitle>
          <DialogDescription>
            Your Replicate account doesn&apos;t have enough credit to run this
            generation. Add funds to continue creating.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/50">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              Replicate charges per generation based on the model used. Visit
              your billing page to purchase credit and continue generating
              images.
            </p>
          </div>

          <div className="bg-muted/50 rounded-lg border border-dashed p-4">
            <p className="text-sm font-medium">How to add credit:</p>
            <ol className="text-muted-foreground mt-2 list-inside list-decimal space-y-1 text-sm">
              <li>Go to your Replicate billing page</li>
              <li>Add a payment method if needed</li>
              <li>Purchase credit (starts at $5)</li>
              <li>Wait a few minutes for it to activate</li>
              <li>Return here and try again</li>
            </ol>
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Close
          </Button>
          <Button asChild className="w-full sm:w-auto">
            <a
              href="https://replicate.com/account/billing#billing"
              target="_blank"
              rel="noopener noreferrer"
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Add Credit
              <ExternalLink className="ml-2 h-3 w-3" />
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


