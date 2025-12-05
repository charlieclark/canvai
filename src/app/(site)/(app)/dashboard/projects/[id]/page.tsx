"use client";

import { api } from "@/trpc/react";
import { useParams, useRouter } from "next/navigation";
import { ProjectCanvas } from "./_components/project-canvas";
import { GenerationsPanel } from "./_components/generations-panel";
import { GeneratePanel } from "./_components/generate-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Check, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState, useCallback } from "react";
import type { Editor, TLShapeId } from "tldraw";

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [editor, setEditor] = useState<Editor | null>(null);
  const [selectedFrameId, setSelectedFrameId] = useState<TLShapeId | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState("");

  const utils = api.useUtils();

  const { data: project, isLoading } = api.project.getById.useQuery(
    { id: projectId },
    { enabled: !!projectId },
  );

  const updateProject = api.project.update.useMutation({
    onSuccess: () => {
      void utils.project.getById.invalidate({ id: projectId });
      setIsEditingName(false);
    },
  });

  const deleteProject = api.project.delete.useMutation({
    onSuccess: () => {
      router.push("/dashboard/projects");
    },
  });

  const handleEditorMount = useCallback((editorInstance: Editor) => {
    setEditor(editorInstance);
  }, []);

  const handleFrameSelect = useCallback((frameId: TLShapeId | null) => {
    setSelectedFrameId(frameId);
  }, []);

  const handleStartEditName = () => {
    if (project) {
      setEditedName(project.name);
      setIsEditingName(true);
    }
  };

  const handleSaveName = () => {
    if (editedName.trim() && editedName !== project?.name) {
      updateProject.mutate({ id: projectId, name: editedName.trim() });
    } else {
      setIsEditingName(false);
    }
  };

  const handleDeleteProject = () => {
    if (confirm("Are you sure you want to delete this project?")) {
      deleteProject.mutate({ id: projectId });
    }
  };

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
      <header className="bg-background flex h-14 shrink-0 items-center justify-between border-b px-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/projects">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>

          {isEditingName ? (
            <div className="flex items-center gap-2">
              <Input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="h-8 w-48"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveName();
                  if (e.key === "Escape") setIsEditingName(false);
                }}
              />
              <Button size="icon" variant="ghost" onClick={handleSaveName}>
                <Check className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold">{project.name}</h1>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleStartEditName}
              >
                <Pencil className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDeleteProject}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Three-panel layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Generations */}
        <GenerationsPanel
          projectId={projectId}
          editor={editor}
          generations={project.generations}
        />

        {/* Main Panel - Canvas */}
        <div className="flex-1">
          <ProjectCanvas
            projectId={projectId}
            initialSnapshot={project.snapshot}
            onEditorMount={handleEditorMount}
            onFrameSelect={handleFrameSelect}
          />
        </div>

        {/* Right Panel - Generate */}
        <GeneratePanel
          projectId={projectId}
          editor={editor}
          selectedFrameId={selectedFrameId}
        />
      </div>
    </div>
  );
}

