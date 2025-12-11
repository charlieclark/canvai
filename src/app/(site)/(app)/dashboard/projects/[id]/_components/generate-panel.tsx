"use client";

import type { Editor, TLShapeId } from "tldraw";
import { GeneratePanelEmpty } from "./generate-panel-empty";
import { GeneratePanelSelected } from "./generate-panel-selected";
import type { AspectRatio, Resolution } from "@/lib/utils/image";

interface GeneratePanelProps {
  projectId: string;
  editor: Editor | null;
  generateFrameId: TLShapeId | null;
  onAddFrame: () => void;
  newFrameAspectRatio: AspectRatio;
  onNewFrameAspectRatioChange: (ratio: AspectRatio) => void;
  resolution: Resolution;
  onResolutionChange: (resolution: Resolution) => void;
  onCreateFrame: () => void;
}

export function GeneratePanel({
  projectId,
  editor,
  generateFrameId,
  onAddFrame,
  newFrameAspectRatio,
  onNewFrameAspectRatioChange,
  resolution,
  onResolutionChange,
  onCreateFrame,
}: GeneratePanelProps) {
  // Empty state - no frame selected
  if (!generateFrameId || !editor) {
    return (
      <GeneratePanelEmpty
        editor={editor}
        newFrameAspectRatio={newFrameAspectRatio}
        onNewFrameAspectRatioChange={onNewFrameAspectRatioChange}
        resolution={resolution}
        onResolutionChange={onResolutionChange}
        onCreateFrame={onCreateFrame}
      />
    );
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
