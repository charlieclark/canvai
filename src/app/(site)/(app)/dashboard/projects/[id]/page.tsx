"use client";

import { api } from "@/trpc/react";
import { useParams, useRouter } from "next/navigation";
import { ProjectCanvas } from "./_components/project-canvas";
import { GenerationsPanel } from "./_components/generations-panel";
import { GeneratePanel } from "./_components/generate-panel";
import { ProjectHeader, type SaveStatus } from "./_components/project-header";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState, useCallback } from "react";
import type { Editor, TLShapeId } from "tldraw";
import { toast } from "sonner";
import {
  ASPECT_RATIOS,
  DEFAULT_RESOLUTION,
  getGenerationDimensions,
  type AspectRatio,
  type Resolution,
} from "@/lib/utils/image";

const FRAME_DISPLAY_SCALE = 1;

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [editor, setEditor] = useState<Editor | null>(null);
  const [selectedFrameId, setSelectedFrameId] = useState<TLShapeId | null>(
    null,
  );
  const [lastSelectedFrameId, setLastSelectedFrameId] =
    useState<TLShapeId | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [frameCount, setFrameCount] = useState(0);
  const [newFrameAspectRatio, setNewFrameAspectRatio] =
    useState<AspectRatio>("1:1");
  const [resolution, setResolution] = useState<Resolution>(DEFAULT_RESOLUTION);

  const utils = api.useUtils();

  const { data: project, isLoading } = api.project.getById.useQuery(
    { id: projectId },
    { enabled: !!projectId },
  );

  const { data: user } = api.user.getCurrent.useQuery();

  const updateProjectName = api.project.update.useMutation({
    onSuccess: () => {
      void utils.project.getById.invalidate({ id: projectId });
    },
  });

  const deleteProject = api.project.delete.useMutation({
    onSuccess: () => {
      router.push("/dashboard/projects");
    },
  });

  const toggleTemplate = api.project.toggleTemplate.useMutation({
    onSuccess: (data) => {
      void utils.project.getById.invalidate({ id: projectId });
      if (data.isTemplate) {
        toast.success("Template created!");
      } else {
        toast.success("Template removed");
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Count frames from editor
  const updateFrameCount = useCallback((editorInstance: Editor) => {
    const shapes = editorInstance.getCurrentPageShapes();
    const frames = shapes.filter((shape) => shape.type === "frame");
    setFrameCount(frames.length);
  }, []);

  const handleEditorMount = useCallback(
    (editorInstance: Editor) => {
      setEditor(editorInstance);
      editorInstance.user.updateUserPreferences({ isSnapMode: true });

      // Initial frame count
      updateFrameCount(editorInstance);

      // Listen for shape changes to update frame count
      const cleanup = editorInstance.store.listen(
        () => {
          updateFrameCount(editorInstance);
        },
        { source: "user", scope: "document" },
      ) as () => void;

      return cleanup;
    },
    [updateFrameCount],
  );

  const handleFrameSelect = useCallback((frameId: TLShapeId | null) => {
    setSelectedFrameId(frameId);
    if (frameId) {
      setLastSelectedFrameId(frameId);
    }
  }, []);

  const handleSaveStatusChange = useCallback((status: SaveStatus) => {
    setSaveStatus(status);
  }, []);

  const handleUpdateName = useCallback(
    (name: string) => {
      updateProjectName.mutate({ id: projectId, name });
    },
    [projectId, updateProjectName],
  );

  const handleDeleteProject = useCallback(() => {
    deleteProject.mutate({ id: projectId });
  }, [deleteProject, projectId]);

  const handleToggleTemplate = useCallback(
    (isTemplate: boolean, slug?: string) => {
      toggleTemplate.mutate({
        id: projectId,
        isTemplate,
        templateSlug: slug,
      });
    },
    [projectId, toggleTemplate],
  );

  // Create a new frame on the canvas
  const handleCreateFrame = useCallback(() => {
    if (!editor) return;

    const ratio = ASPECT_RATIOS.find((r) => r.value === newFrameAspectRatio);
    if (!ratio) return;

    // Use resolution-based dimensions for the frame
    const dimensions = getGenerationDimensions(newFrameAspectRatio, resolution);
    const displayWidth = dimensions.width * FRAME_DISPLAY_SCALE;
    const displayHeight = dimensions.height * FRAME_DISPLAY_SCALE;

    const frameId = `shape:frame-${Date.now()}` as TLShapeId;
    const resolutionLabel = resolution === 2 ? "2K" : "1K";

    if (!selectedFrameId) {
      // Check if there are selected elements (non-frames) to wrap
      const selectedShapes = editor.getSelectedShapes();
      const nonFrameSelectedShapes = selectedShapes.filter(
        (shape) => shape.type !== "frame",
      );

      if (nonFrameSelectedShapes.length > 0) {
        // Get the bounding box of selected elements
        const selectionBounds = editor.getSelectionRotatedPageBounds();
        if (selectionBounds) {
          // Add padding inside the frame
          const padding = 40;
          const availableWidth = displayWidth - padding * 2;
          const availableHeight = displayHeight - padding * 2;

          // Calculate scale factor to fit selection within frame
          const scaleX = availableWidth / selectionBounds.width;
          const scaleY = availableHeight / selectionBounds.height;
          const scale = Math.min(scaleX, scaleY, 1); // Don't scale up, only down

          // Center of the selection (before scaling)
          const selectionCenterX =
            selectionBounds.x + selectionBounds.width / 2;
          const selectionCenterY =
            selectionBounds.y + selectionBounds.height / 2;

          // Position frame centered on current selection center
          const frameX = selectionCenterX - displayWidth / 2;
          const frameY = selectionCenterY - displayHeight / 2;

          // Create the frame first
          editor.createShape({
            id: frameId,
            type: "frame",
            x: frameX,
            y: frameY,
            props: {
              w: displayWidth,
              h: displayHeight,
              name: `${ratio.label} - ${resolutionLabel}`,
            },
          });

          // Scale and center the selected shapes if needed
          if (scale < 1) {
            // Scale each shape around the selection center
            for (const shape of nonFrameSelectedShapes) {
              editor.resizeShape(
                shape.id,
                { x: scale, y: scale },
                {
                  scaleOrigin: { x: selectionCenterX, y: selectionCenterY },
                },
              );
            }
          }

          // Reparent selected shapes to the new frame
          editor.reparentShapes(
            nonFrameSelectedShapes.map((s) => s.id),
            frameId,
          );

          editor.select(frameId);
          editor.zoomToSelection({ animation: { duration: 200 } });
          return;
        }
      }
    }

    // No selected elements - create empty frame at a non-overlapping position
    const existingFrames = editor
      .getCurrentPageShapes()
      .filter((shape) => shape.type === "frame");

    const overlapsExistingFrame = (x: number, y: number) => {
      const padding = 40;
      const newLeft = x;
      const newRight = x + displayWidth;
      const newTop = y;
      const newBottom = y + displayHeight;

      return existingFrames.some((frame) => {
        const bounds = editor.getShapeGeometry(frame).bounds;
        const frameLeft = frame.x - padding;
        const frameRight = frame.x + bounds.width + padding;
        const frameTop = frame.y - padding;
        const frameBottom = frame.y + bounds.height + padding;

        return (
          newLeft < frameRight &&
          newRight > frameLeft &&
          newTop < frameBottom &&
          newBottom > frameTop
        );
      });
    };

    let x = -displayWidth / 2;
    const y = -displayHeight / 2;
    const stepSize = displayWidth + 60;

    for (let i = 0; i < 50; i++) {
      if (!overlapsExistingFrame(x, y)) break;
      x += stepSize;
    }

    editor.createShape({
      id: frameId,
      type: "frame",
      x,
      y,
      props: {
        w: displayWidth,
        h: displayHeight,
        name: `${ratio.label} - ${resolutionLabel}`,
      },
    });

    editor.select(frameId);
    editor.zoomToSelection({ animation: { duration: 200 } });
  }, [editor, newFrameAspectRatio, resolution, selectedFrameId]);

  const isAdmin = user?.role === "ADMIN";

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading project...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <div className="text-muted-foreground">Project not found</div>
        <Link href="/dashboard/projects">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      {/* Top Nav */}
      <ProjectHeader
        projectName={project.name}
        saveStatus={saveStatus}
        onUpdateName={handleUpdateName}
        onDelete={handleDeleteProject}
        isUpdatingName={updateProjectName.isPending}
        isAdmin={isAdmin}
        isTemplate={project.isTemplate}
        templateSlug={project.templateSlug}
        frameCount={frameCount}
        onToggleTemplate={handleToggleTemplate}
        isTogglingTemplate={toggleTemplate.isPending}
      />

      {/* Three-panel layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Generations */}
        <GenerationsPanel
          projectId={projectId}
          editor={editor}
          selectedFrameId={selectedFrameId}
        />

        {/* Main Panel - Canvas */}
        <div className="flex-1">
          <ProjectCanvas
            projectId={projectId}
            initialSnapshot={project.snapshot}
            onEditorMount={handleEditorMount}
            onFrameSelect={handleFrameSelect}
            onSaveStatusChange={handleSaveStatusChange}
          />
        </div>

        {/* Right Panel - Generate */}
        <GeneratePanel
          projectId={projectId}
          editor={editor}
          generateFrameId={lastSelectedFrameId}
          onAddFrame={() => {
            handleCreateFrame();
            if (selectedFrameId) {
              // TODO: add new frame
              // editor?.selectNone();
              // setLastSelectedFrameId(null);
            } else {
            }
          }}
          newFrameAspectRatio={newFrameAspectRatio}
          onNewFrameAspectRatioChange={setNewFrameAspectRatio}
          resolution={resolution}
          onResolutionChange={setResolution}
          onCreateFrame={handleCreateFrame}
        />
      </div>
    </div>
  );
}
