"use client";

import { useCallback, useMemo } from "react";
import {
  Tldraw,
  type Editor,
  type StoreSnapshot,
  type TLRecord,
  type TLAssetStore,
  loadSnapshot,
  uniqueId,
} from "tldraw";
import "tldraw/tldraw.css";

interface TemplateCanvasProps {
  snapshot: unknown;
  onEditorMount: (editor: Editor) => void;
}

export function TemplateCanvas({ snapshot, onEditorMount }: TemplateCanvasProps) {
  // Asset store for handling images
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

  const handleMount = useCallback(
    (editor: Editor) => {
      // Load the snapshot
      if (snapshot) {
        try {
          loadSnapshot(editor.store, snapshot as StoreSnapshot<TLRecord>);
        } catch (error) {
          console.error("Failed to load template snapshot:", error);
        }
      }

      // Zoom to fit the content
      editor.zoomToFit();

      // Pass editor reference to parent
      onEditorMount(editor);
    },
    [snapshot, onEditorMount],
  );

  return (
    <div className="h-full w-full">
      <Tldraw
        licenseKey="tldraw-2026-03-14/WyJUWlhfdlRCZCIsWyIqIl0sMTYsIjIwMjYtMDMtMTQiXQ.hYq9Rva6LHHniBX2XLwl//6NTQtiZutQR39uNRHfwSVvpudnHl6HosiZoA7gAwShslzMJeojyvRpsLbAAZgCoA"
        onMount={handleMount}
        assets={assetStore}
        components={{
          // Hide navigation UI but keep drawing tools
          PageMenu: null,
          MainMenu: null,
          NavigationPanel: null,
          DebugPanel: null,
          DebugMenu: null,
          HelpMenu: null,
          KeyboardShortcutsDialog: null,
        }}
      />
    </div>
  );
}
