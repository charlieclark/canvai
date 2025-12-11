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
            if (selectedFrameId === lastSelectedFrameId) {
              // TODO: add new frame
            } else {
              // TODO: frame selection
            }
          }}
        />
      </div>
    </div>
  );
}
