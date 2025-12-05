import { type ReactNode } from "react";

interface DashboardHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

export function DashboardHeader({
  title,
  description,
  children,
}: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="mt-2 text-muted-foreground">{description}</p>
        )}
      </div>
      {children && <div className="ml-4 flex-shrink-0">{children}</div>}
    </div>
  );
} 