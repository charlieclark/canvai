"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Key, Loader2, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

interface ApiKeyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function ApiKeyModal({
  open,
  onOpenChange,
  onSuccess,
}: ApiKeyModalProps) {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);

  const utils = api.useUtils();

  const saveKeyMutation = api.user.saveReplicateKey.useMutation({
    onSuccess: () => {
      toast({
        title: "API key saved",
        description:
          "Your Replicate API key has been saved. You can now generate images!",
      });
      setApiKey("");
      void utils.user.hasReplicateKey.invalidate();
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error) => {
      toast({
        title: "Failed to save API key",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSaveKey = () => {
    if (!apiKey.trim()) return;
    saveKeyMutation.mutate({ apiKey: apiKey.trim() });
  };

  const handleClose = (newOpen: boolean) => {
    if (!newOpen && !saveKeyMutation.isPending) {
      setApiKey("");
      setShowKey(false);
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Replicate API Key Required
          </DialogTitle>
          <DialogDescription>
            To generate images without a subscription, you need to add your
            Replicate API key. Your key is stored securely and only used for
            your generations.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-muted/50 rounded-lg border border-dashed p-4">
            <p className="text-sm">
              Don&apos;t have a Replicate account?{" "}
              <a
                href="https://replicate.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary inline-flex items-center gap-1 font-medium underline underline-offset-4 hover:no-underline"
              >
                Sign up
                <ExternalLink className="h-3 w-3" />
              </a>
            </p>
            <p className="text-muted-foreground mt-1 text-xs">
              Replicate offers pay-per-use pricing with no minimum commitments.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="modal-api-key">API Key</Label>
            <div className="flex gap-2">
              <Input
                id="modal-api-key"
                type={showKey ? "text" : "password"}
                placeholder="r8_••••••••••••••••••••••••••••••••"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="font-mono"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && apiKey.trim()) {
                    handleSaveKey();
                  }
                }}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowKey(!showKey)}
                className="shrink-0"
              >
                {showKey ? "Hide" : "Show"}
              </Button>
            </div>
            <p className="text-muted-foreground text-xs">
              Find your API key at{" "}
              <a
                href="https://replicate.com/account/api-tokens"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-4 hover:no-underline"
              >
                replicate.com/account/api-tokens
              </a>
            </p>
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link href="/dashboard/settings">Go to Settings</Link>
          </Button>
          <Button
            onClick={handleSaveKey}
            disabled={!apiKey.trim() || saveKeyMutation.isPending}
            className="w-full sm:w-auto"
          >
            {saveKeyMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save & Continue"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


