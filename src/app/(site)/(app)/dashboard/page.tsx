"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const hasStartedOnboarding = useRef(false);

  const { data: user, isLoading: isLoadingUser } =
    api.user.getCurrent.useQuery();

  const completeOnboarding = api.user.completeOnboarding.useMutation({
    onSuccess: (data) => {
      if (data.projectId) {
        // Redirect to their first project
        router.replace(`/dashboard/projects/${data.projectId}`);
      } else {
        // Fallback to projects list
        router.replace("/dashboard/projects");
      }
    },
    onError: () => {
      // On error, fall back to projects list
      router.replace("/dashboard/projects");
    },
  });

  useEffect(() => {
    if (isLoadingUser || !user) return;

    if (hasStartedOnboarding.current) {
      return;
    }

    // If onboarding is already completed, go to projects
    if (user.onboardingCompletedAt) {
      router.replace("/dashboard/projects");
      return;
    }

    hasStartedOnboarding.current = true;
    completeOnboarding.mutate();
  }, [user, isLoadingUser, router, completeOnboarding]);

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      <p className="text-muted-foreground">Setting up your workspace...</p>
    </div>
  );
}
