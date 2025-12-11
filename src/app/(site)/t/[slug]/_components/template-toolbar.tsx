"use client";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";
import useSignupModal from "@/hooks/use-signup";
import { Sparkles } from "lucide-react";
import type { Editor } from "tldraw";

// Key for storing template snapshot in sessionStorage
export const TEMPLATE_SNAPSHOT_KEY = "template-snapshot";

interface TemplateToolbarProps {
  name: string;
  slug: string;
  editor: Editor | null;
}

export function TemplateToolbar({ name, slug, editor }: TemplateToolbarProps) {
  const { openSignupModal } = useSignupModal();

  const handleStartCreating = () => {
    // Capture current canvas state before redirecting
    if (editor) {
      const snapshot = editor.store.getStoreSnapshot();
      sessionStorage.setItem(TEMPLATE_SNAPSHOT_KEY, JSON.stringify(snapshot));
    }

    openSignupModal({
      redirectUrl: `/dashboard/projects/from-template/${slug}`,
    });
  };

  return (
    <div className="border-t bg-white/95 backdrop-blur-sm">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left: Logo and template name */}
        <div className="flex items-center gap-4">
          <Logo className="h-8" />
          <div className="h-6 w-px bg-gray-200" />
          <div>
            <p className="text-sm text-gray-500">Template</p>
            <h1 className="font-semibold text-gray-900">{name}</h1>
          </div>
        </div>

        {/* Right: CTA button */}
        <Button
          size="lg"
          onClick={handleStartCreating}
          className="gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 px-8 text-white shadow-lg transition-all hover:from-violet-700 hover:to-indigo-700 hover:shadow-xl"
        >
          <Sparkles className="h-5 w-5" />
          Generate Image
        </Button>
      </div>
    </div>
  );
}
