"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Tldraw,
  DefaultStylePanel,
  DefaultStylePanelContent,
  DefaultFontStyle,
  DefaultSizeStyle,
  FrameShapeUtil,
  type Editor,
  type TLShapeId,
  type StoreSnapshot,
  type TLRecord,
  type TLAssetStore,
  loadSnapshot,
  uniqueId,
  useRelevantStyles,
} from "tldraw";
import "tldraw/tldraw.css";
import { api } from "@/trpc/react";
import type { SaveStatus } from "./project-header";

// Custom FrameShapeUtil that prevents resizing (hides resize handles)
class LockedFrameShapeUtil extends FrameShapeUtil {
  override canResize = () => false;
}

// Register the custom shape utils
const customShapeUtils = [LockedFrameShapeUtil];

interface ProjectCanvasProps {
  projectId: string;
  initialSnapshot: unknown;
  onEditorMount: (editor: Editor) => void;
  onFrameSelect: (frameId: TLShapeId | null) => void;
  onSaveStatusChange?: (status: SaveStatus) => void;
}

export function ProjectCanvas({
  projectId,
  initialSnapshot,
  onEditorMount,
  onFrameSelect,
  onSaveStatusChange,
}: ProjectCanvasProps) {
  const editorRef = useRef<Editor | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isPending, setIsPending] = useState(false);

  const updateProject = api.project.update.useMutation({
    onSuccess: () => {
      // Show "saved" status briefly after successful save
      onSaveStatusChange?.("saved");
      savedTimeoutRef.current = setTimeout(() => {
        onSaveStatusChange?.("idle");
      }, 2000);
    },
  });

  // Update save status based on state
  useEffect(() => {
    if (updateProject.isPending) {
      onSaveStatusChange?.("saving");
    } else if (isPending) {
      onSaveStatusChange?.("pending");
    }
  }, [isPending, updateProject.isPending, onSaveStatusChange]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (savedTimeoutRef.current) clearTimeout(savedTimeoutRef.current);
    };
  }, []);

  // Debounced save function with pending tracking
  const saveSnapshot = useCallback(
    (editor: Editor) => {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      // Clear any "saved" timeout
      if (savedTimeoutRef.current) {
        clearTimeout(savedTimeoutRef.current);
      }

      setIsPending(true);

      timeoutRef.current = setTimeout(() => {
        setIsPending(false);
        const snapshot = editor.store.getStoreSnapshot();
        updateProject.mutate({
          id: projectId,
          snapshot: snapshot,
        });
      }, 2000);
    },
    [projectId, updateProject],
  );

  // Asset store for handling hosted images
  const assetStore = useMemo<TLAssetStore>(
    () => ({
      async upload(_asset, file) {
        const id = uniqueId();
        const filename = `${id}-${file.name}`.replaceAll(/[^\w.-]/g, "-");

        const response = await fetch(
          `/api/upload?filename=${encodeURIComponent(filename)}`,
          {
            method: "POST",
            headers: {
              "Content-Type": file.type,
            },
            body: file,
          },
        );

        if (!response.ok) {
          throw new Error("Failed to upload image");
        }

        const blob = (await response.json()) as { url: string };
        return { src: blob.url };
      },

      resolve(asset) {
        return asset.props.src;
      },
    }),
    [],
  );

  // Handle frame selection changes
  const handleSelectionChange = useCallback(
    (editor: Editor) => {
      const selectedShapes = editor.getSelectedShapes();

      // First, check if a frame itself is directly selected
      const selectedFrame = selectedShapes.find(
        (shape) => shape.type === "frame",
      );

      if (selectedFrame) {
        onFrameSelect(selectedFrame.id);
        return;
      }

      // If no frame is directly selected, check if any selected shape is a child of a frame
      for (const shape of selectedShapes) {
        if (shape.parentId) {
          const parent = editor.getShape(shape.parentId);
          if (parent?.type === "frame") {
            onFrameSelect(parent.id);
            return;
          }
        }
      }

      onFrameSelect(null);
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

      editor.zoomToFit();

      // Set default styles
      editor.setStyleForNextShapes(DefaultFontStyle, "sans");
      editor.setStyleForNextShapes(DefaultSizeStyle, "l");

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
      <Tldraw
        licenseKey="tldraw-2026-03-14/WyJUWlhfdlRCZCIsWyIqIl0sMTYsIjIwMjYtMDMtMTQiXQ.hYq9Rva6LHHniBX2XLwl//6NTQtiZutQR39uNRHfwSVvpudnHl6HosiZoA7gAwShslzMJeojyvRpsLbAAZgCoA"
        onMount={handleMount}
        assets={assetStore}
        shapeUtils={customShapeUtils}
        components={{
          StylePanel: CollapsibleStylePanel,
        }}
      />
    </div>
  );
}

function CollapsibleStylePanel() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const styles = useRelevantStyles();

  if (!styles) return null;

  return (
    <DefaultStylePanel>
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="flex w-full items-center justify-center border-b px-2 py-1.5 text-xs text-gray-500 hover:bg-gray-50"
      >
        {isCollapsed ? "Show styles ▼" : "Hide styles ▲"}
      </button>
      {!isCollapsed && <DefaultStylePanelContent />}
    </DefaultStylePanel>
  );
}
