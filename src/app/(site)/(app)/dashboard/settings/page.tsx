"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Key, Loader2, Check, Trash2, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);

  const utils = api.useUtils();

  const { data: hasKey, isLoading: isCheckingKey } =
    api.user.hasReplicateKey.useQuery();

  const saveKeyMutation = api.user.saveReplicateKey.useMutation({
    onSuccess: () => {
      toast({
        title: "API key saved",
        description: "Your Replicate API key has been saved successfully.",
      });
      setApiKey("");
      void utils.user.hasReplicateKey.invalidate();
    },
    onError: (error) => {
      toast({
        title: "Failed to save API key",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const removeKeyMutation = api.user.removeReplicateKey.useMutation({
    onSuccess: () => {
      toast({
        title: "API key removed",
        description: "Your Replicate API key has been removed.",
      });
      void utils.user.hasReplicateKey.invalidate();
    },
    onError: (error) => {
      toast({
        title: "Failed to remove API key",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSaveKey = () => {
    if (!apiKey.trim()) return;
    saveKeyMutation.mutate({ apiKey: apiKey.trim() });
  };

  const handleRemoveKey = () => {
    removeKeyMutation.mutate();
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings and API integrations.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Replicate API Key
          </CardTitle>
          <CardDescription>
            You may add a Replicate API key to generate images without a
            subscription. You can get your API key from the{" "}
            <a
              href="https://replicate.com/account/api-tokens"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary inline-flex items-center gap-1 underline underline-offset-4 hover:no-underline"
            >
              Replicate dashboard
              <ExternalLink className="h-3 w-3" />
            </a>
            .
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isCheckingKey ? (
            <div className="text-muted-foreground flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Checking API key status...
            </div>
          ) : hasKey ? (
            <div className="space-y-4">
              <div className="bg-muted/50 flex items-center gap-3 rounded-lg border p-4">
                <div className="bg-primary/10 text-primary rounded-full p-2">
                  <Check className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">API key configured</p>
                  <p className="text-muted-foreground text-sm">
                    Your Replicate API key is set up and ready to use.
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="update-api-key">Update API Key</Label>
                  <div className="flex gap-2">
                    <Input
                      id="update-api-key"
                      type={showKey ? "text" : "password"}
                      placeholder="r8_••••••••••••••••••••••••••••••••"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="font-mono"
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
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleSaveKey}
                  disabled={!apiKey.trim() || saveKeyMutation.isPending}
                >
                  {saveKeyMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Update Key"
                  )}
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      disabled={removeKeyMutation.isPending}
                    >
                      {removeKeyMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Removing...
                        </>
                      ) : (
                        <>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remove Key
                        </>
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remove API Key?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will remove your Replicate API key. You won&apos;t
                        be able to generate images until you add a new key.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleRemoveKey}>
                        Remove
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-muted/50 flex items-center gap-3 rounded-lg border border-dashed p-4">
                <div className="bg-muted text-muted-foreground rounded-full p-2">
                  <Key className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">No API key configured</p>
                  <p className="text-muted-foreground text-sm">
                    Add your Replicate API key to start generating images.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <div className="flex gap-2">
                  <Input
                    id="api-key"
                    type={showKey ? "text" : "password"}
                    placeholder="r8_••••••••••••••••••••••••••••••••"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="font-mono"
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
                  Your API key starts with &quot;r8_&quot; and can be found in
                  your Replicate account settings.
                </p>
              </div>

              <Button
                onClick={handleSaveKey}
                disabled={!apiKey.trim() || saveKeyMutation.isPending}
              >
                {saveKeyMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save API Key"
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


