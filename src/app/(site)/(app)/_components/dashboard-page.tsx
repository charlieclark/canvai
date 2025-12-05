import { cn } from "@/lib/utils";
import { type PropsWithChildren, type ReactNode } from "react";

type Props = {
  title: ReactNode;
  description?: ReactNode;
  cta?: ReactNode;
  variant?: "full-width";
} & PropsWithChildren;

export default function DashboardPage({
  title,
  description,
  cta,
  children,
  variant,
}: Props) {
  return (
    <div className={cn("px-10 py-8", variant !== "full-width" && "container")}>
      <div className={cn("mx-auto", variant !== "full-width" && "max-w-2xl")}>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">{title}</h1>
            {description && (
              <div className="text-muted-foreground">{description}</div>
            )}
          </div>
          {cta}
        </div>
        {children}
      </div>
    </div>
  );
}
