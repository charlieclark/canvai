"use client";

import { useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { Loader2 } from "lucide-react";
import { TEMPLATE_SNAPSHOT_KEY } from "@/app/(site)/t/[slug]/_components/template-toolbar";

export default function CloneTemplatePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const hasCloned = useRef(false);

  const cloneMutation = api.template.clone.useMutation({
    onSuccess: (project) => {
      // Clean up sessionStorage
      sessionStorage.removeItem(TEMPLATE_SNAPSHOT_KEY);
      router.replace(`/dashboard/projects/${project.id}`);
    },
    onError: () => {
      // Clean up sessionStorage
      sessionStorage.removeItem(TEMPLATE_SNAPSHOT_KEY);
      // If cloning fails, redirect to projects list
      router.replace("/dashboard/projects");
    },
  });

  useEffect(() => {
    // Only clone once
    if (hasCloned.current) return;
    hasCloned.current = true;

    // Check for modified snapshot in sessionStorage
    const storedSnapshot = sessionStorage.getItem(TEMPLATE_SNAPSHOT_KEY);
    let snapshot: unknown = undefined;

    if (storedSnapshot) {
      try {
        snapshot = JSON.parse(storedSnapshot);
      } catch {
        console.error("Failed to parse stored snapshot");
      }
    }

    cloneMutation.mutate({ slug, snapshot });
  }, [slug, cloneMutation]);

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      <p className="text-muted-foreground">Creating your project...</p>
    </div>
  );
}
