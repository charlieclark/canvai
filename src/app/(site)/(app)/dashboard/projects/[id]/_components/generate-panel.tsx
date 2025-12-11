"use client";

import type { Editor, TLShapeId } from "tldraw";
import { GeneratePanelEmpty } from "./generate-panel-empty";
import { GeneratePanelSelected } from "./generate-panel-selected";

interface GeneratePanelProps {
  projectId: string;
  editor: Editor | null;
  generateFrameId: TLShapeId | null;
  onAddFrame: () => void;
}

export function GeneratePanel({
  projectId,
  editor,
  generateFrameId,
  onAddFrame,
}: GeneratePanelProps) {
  // Empty state - no frame selected
  if (!generateFrameId || !editor) {
    return <GeneratePanelEmpty editor={editor} />;
  }

  // Frame selected state
  return (
    <GeneratePanelSelected
      projectId={projectId}
      editor={editor}
      generateFrameId={generateFrameId}
      onAddFrame={onAddFrame}
    />
  );
}
