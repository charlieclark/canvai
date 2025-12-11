"use client";

import { useState, useCallback } from "react";
import { TemplateCanvas } from "./template-canvas";
import { TemplateToolbar } from "./template-toolbar";
import type { Editor } from "tldraw";

interface TemplateViewProps {
  name: string;
  slug: string;
  snapshot: unknown;
}

export function TemplateView({ name, slug, snapshot }: TemplateViewProps) {
  const [editor, setEditor] = useState<Editor | null>(null);

  const handleEditorMount = useCallback((editorInstance: Editor) => {
    setEditor(editorInstance);
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col bg-gray-100">
      {/* Canvas takes up the full screen */}
      <div className="flex-1">
        <TemplateCanvas snapshot={snapshot} onEditorMount={handleEditorMount} />
      </div>

      {/* Bottom toolbar */}
      <TemplateToolbar name={name} slug={slug} editor={editor} />
    </div>
  );
}
