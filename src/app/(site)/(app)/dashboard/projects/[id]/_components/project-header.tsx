"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Check, Loader2, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export type SaveStatus = "idle" | "pending" | "saving" | "saved";

interface ProjectHeaderProps {
  projectName: string;
  saveStatus: SaveStatus;
  onUpdateName: (name: string) => void;
  onDelete: () => void;
  isUpdatingName?: boolean;
}

export function ProjectHeader({
  projectName,
  saveStatus,
  onUpdateName,
  onDelete,
  isUpdatingName,
}: ProjectHeaderProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState("");

  const handleStartEditName = () => {
    setEditedName(projectName);
    setIsEditingName(true);
  };

  const handleSaveName = () => {
    if (editedName.trim() && editedName !== projectName) {
      onUpdateName(editedName.trim());
    }
    setIsEditingName(false);
  };

  const handleDeleteProject = () => {
    if (confirm("Are you sure you want to delete this project?")) {
      onDelete();
    }
  };

  return (
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
            <Button
              size="icon"
              variant="ghost"
              onClick={handleSaveName}
              disabled={isUpdatingName}
            >
              <Check className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold">{projectName}</h1>
            <Button size="icon" variant="ghost" onClick={handleStartEditName}>
              <Pencil className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Save Status Indicator */}
        <SaveStatusIndicator status={saveStatus} />

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
  );
}

function SaveStatusIndicator({ status }: { status: SaveStatus }) {
  const isUnsaved = status === "pending" || status === "saving";

  if (!isUnsaved) return null;

  return <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />;
}
