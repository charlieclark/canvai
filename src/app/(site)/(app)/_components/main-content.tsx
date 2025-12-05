"use client";

import { usePathname } from "next/navigation";

// Check if we're on a project detail page (e.g., /dashboard/projects/[id])
function isProjectDetailPage(pathname: string) {
  return /^\/dashboard\/projects\/[^/]+$/.test(pathname);
}

export function MainContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isFullWidth = isProjectDetailPage(pathname);

  if (isFullWidth) {
    return <main className="flex-1">{children}</main>;
  }

  return (
    <main className="flex-1 lg:pl-64">
      <div className="container relative mx-auto min-h-[calc(100vh-4rem)]">
        {children}
      </div>
    </main>
  );
}

