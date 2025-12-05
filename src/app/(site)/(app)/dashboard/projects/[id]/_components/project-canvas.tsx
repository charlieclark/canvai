"use client";

import { useCallback, useRef } from "react";
import {
  Tldraw,
  type Editor,
  type TLShapeId,
  type StoreSnapshot,
  type TLRecord,
  loadSnapshot,
} from "tldraw";
import "tldraw/tldraw.css";
import { api } from "@/trpc/react";
import { useDebouncedCallback } from "@/hooks/use-debounce";

interface ProjectCanvasProps {
  projectId: string;
  initialSnapshot: unknown;
  onEditorMount: (editor: Editor) => void;
  onFrameSelect: (frameId: TLShapeId | null) => void;
}

export function ProjectCanvas({
  projectId,
  initialSnapshot,
  onEditorMount,
  onFrameSelect,
}: ProjectCanvasProps) {
  const editorRef = useRef<Editor | null>(null);

  const updateProject = api.project.update.useMutation();

  // Debounced save function
  const saveSnapshot = useDebouncedCallback((editor: Editor) => {
    const snapshot = editor.store.getStoreSnapshot();
    updateProject.mutate({
      id: projectId,
      snapshot: snapshot,
    });
  }, 2000);

  // Handle frame selection changes
  const handleSelectionChange = useCallback(
    (editor: Editor) => {
      const selectedShapes = editor.getSelectedShapes();

      // Find the first selected frame
      const selectedFrame = selectedShapes.find(
        (shape) => shape.type === "frame",
      );

      if (selectedFrame) {
        onFrameSelect(selectedFrame.id);
      } else {
        onFrameSelect(null);
      }
    },
    [onFrameSelect],
  );

  const handleMount = useCallback(
    (editor: Editor) => {
      editorRef.current = editor;
      onEditorMount(editor);

      // Load initial snapshot if available
      if (initialSnapshot) {
        try {
          loadSnapshot(
            editor.store,
            initialSnapshot as StoreSnapshot<TLRecord>,
          );
        } catch (error) {
          console.error("Failed to load snapshot:", error);
        }
      }

      // Listen for changes to save
      const removeListener = editor.store.listen(
        () => {
          saveSnapshot(editor);
        },
        { source: "user", scope: "document" },
      ) as () => void;

      // Listen for selection changes
      const cleanupSelection = editor.store.listen(
        () => {
          handleSelectionChange(editor);
        },
        { source: "user", scope: "session" },
      ) as () => void;

      return () => {
        removeListener();
        cleanupSelection();
      };
    },
    [initialSnapshot, onEditorMount, saveSnapshot, handleSelectionChange],
  );

  return (
    <div className="h-full w-full">
      <Tldraw onMount={handleMount} />
    </div>
  );
}
