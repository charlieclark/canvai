"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ArrowLeft,
  Check,
  Coins,
  Copy,
  ExternalLink,
  Globe,
  Loader2,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/trpc/react";

export type SaveStatus = "idle" | "pending" | "saving" | "saved";

interface ProjectHeaderProps {
  projectName: string;
  saveStatus: SaveStatus;
  onUpdateName: (name: string) => void;
  onDelete: () => void;
  isUpdatingName?: boolean;
  // Template props
  isAdmin?: boolean;
  isTemplate?: boolean;
  templateSlug?: string | null;
  frameCount?: number;
  onToggleTemplate?: (isTemplate: boolean, slug?: string) => void;
  isTogglingTemplate?: boolean;
}

export function ProjectHeader({
  projectName,
  saveStatus,
  onUpdateName,
  onDelete,
  isUpdatingName,
  isAdmin,
  isTemplate,
  templateSlug,
  frameCount,
  onToggleTemplate,
  isTogglingTemplate,
}: ProjectHeaderProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [isTemplatePopoverOpen, setIsTemplatePopoverOpen] = useState(false);
  const [newSlug, setNewSlug] = useState("");

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

  const handleMakeTemplate = () => {
    if (!newSlug.trim()) {
      toast.error("Please enter a slug");
      return;
    }
    onToggleTemplate?.(true, newSlug.trim().toLowerCase());
    setIsTemplatePopoverOpen(false);
    setNewSlug("");
  };

  const handleRemoveTemplate = () => {
    onToggleTemplate?.(false);
  };

  const templateUrl =
    typeof window !== "undefined" && templateSlug
      ? `${window.location.origin}/t/${templateSlug}`
      : "";

  const handleCopyUrl = () => {
    void navigator.clipboard.writeText(templateUrl);
    toast.success("Template URL copied!");
  };

  const canBeTemplate = frameCount === 1;

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

      <div className="flex items-center gap-2">
        {/* Credits Indicator */}
        <CreditsIndicator />

        {/* Save Status Indicator */}
        <SaveStatusIndicator status={saveStatus} />

        {/* Template Controls (Admin only) */}
        {isAdmin && (
          <>
            {isTemplate && templateSlug ? (
              <div className="flex items-center gap-1">
                <div className="flex items-center gap-2 rounded-md border bg-violet-50 px-3 py-1.5">
                  <Globe className="h-4 w-4 text-violet-600" />
                  <span className="text-sm font-medium text-violet-700">
                    Template
                  </span>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleCopyUrl}
                      className="h-8 w-8"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Copy template URL</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                      className="h-8 w-8"
                    >
                      <a
                        href={`/t/${templateSlug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>View template</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleRemoveTemplate}
                      disabled={isTogglingTemplate}
                      className="h-8 w-8 text-red-600 hover:text-red-700"
                    >
                      {isTogglingTemplate ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Remove template</TooltipContent>
                </Tooltip>
              </div>
            ) : (
              <Popover
                open={isTemplatePopoverOpen}
                onOpenChange={setIsTemplatePopoverOpen}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!canBeTemplate}
                        className="gap-2"
                      >
                        <Globe className="h-4 w-4" />
                        Make Template
                      </Button>
                    </PopoverTrigger>
                  </TooltipTrigger>
                  {!canBeTemplate && (
                    <TooltipContent>
                      Project must have exactly 1 frame to be a template
                    </TooltipContent>
                  )}
                </Tooltip>
                <PopoverContent className="w-80" align="end">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">Create Template</h4>
                      <p className="text-muted-foreground text-sm">
                        Make this project publicly shareable
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="slug"
                        className="text-sm font-medium leading-none"
                      >
                        Template Slug
                      </label>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-sm">
                          /t/
                        </span>
                        <Input
                          id="slug"
                          placeholder="my-template"
                          value={newSlug}
                          onChange={(e) =>
                            setNewSlug(
                              e.target.value
                                .toLowerCase()
                                .replace(/[^a-z0-9-]/g, ""),
                            )
                          }
                          className="h-8"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleMakeTemplate();
                          }}
                        />
                      </div>
                      <p className="text-muted-foreground text-xs">
                        Lowercase letters, numbers, and hyphens only
                      </p>
                    </div>
                    <Button
                      onClick={handleMakeTemplate}
                      disabled={!newSlug.trim() || isTogglingTemplate}
                      className="w-full"
                    >
                      {isTogglingTemplate ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      Create Template
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </>
        )}

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

function CreditsIndicator() {
  const { data: creditsStatus } = api.generation.getCreditsStatus.useQuery();

  if (!creditsStatus) return null;

  // Only show for subscribed users with credits
  if (creditsStatus.plan !== "SUBSCRIBED") {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href="/dashboard/billing">
            <div className="flex items-center gap-1.5 rounded-md border border-violet-200 bg-violet-50 px-2.5 py-1 dark:border-violet-800 dark:bg-violet-950/50">
              <Coins className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
              <span className="text-xs font-medium text-violet-700 dark:text-violet-300">
                {creditsStatus.credits} credits
              </span>
            </div>
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>Get more credits</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link href="/dashboard/billing">
          <div className="flex items-center gap-1.5 rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1 dark:border-amber-800 dark:bg-amber-950/50">
            <Coins className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            <span className="text-xs font-medium text-amber-700 dark:text-amber-300">
              {creditsStatus.credits} credits
            </span>
          </div>
        </Link>
      </TooltipTrigger>
      <TooltipContent>
        <p>Remaining credits this period</p>
      </TooltipContent>
    </Tooltip>
  );
}
