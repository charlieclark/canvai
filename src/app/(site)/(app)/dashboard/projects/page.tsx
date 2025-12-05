"use client";

import { api } from "@/trpc/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Folder, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";

export default function ProjectsPage() {
  const [isCreating, setIsCreating] = useState(false);
  const utils = api.useUtils();

  const { data: projects, isLoading } = api.project.list.useQuery();

  const createProject = api.project.create.useMutation({
    onSuccess: () => {
      void utils.project.list.invalidate();
      setIsCreating(false);
    },
  });

  const handleCreateProject = () => {
    setIsCreating(true);
    createProject.mutate({ name: `Project ${(projects?.length ?? 0) + 1}` });
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-muted-foreground">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage your image generation projects
          </p>
        </div>
        <Button onClick={handleCreateProject} disabled={isCreating}>
          <Plus className="mr-2 h-4 w-4" />
          {isCreating ? "Creating..." : "New Project"}
        </Button>
      </div>

      {projects?.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Folder className="text-muted-foreground mb-4 h-12 w-12" />
            <h3 className="mb-2 text-lg font-medium">No projects yet</h3>
            <p className="text-muted-foreground mb-4 text-sm">
              Create your first project to get started
            </p>
            <Button onClick={handleCreateProject} disabled={isCreating}>
              <Plus className="mr-2 h-4 w-4" />
              Create Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects?.map((project) => (
            <Link
              key={project.id}
              href={`/dashboard/projects/${project.id}`}
              className="group"
            >
              <Card className="transition-shadow hover:shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Folder className="h-5 w-5" />
                    {project.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-muted-foreground flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <ImageIcon className="h-4 w-4" />
                      {project._count.generations} generations
                    </span>
                    <span>
                      {formatDistanceToNow(new Date(project.updatedAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

