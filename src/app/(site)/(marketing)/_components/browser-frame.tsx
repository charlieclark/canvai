import { cn } from "@/lib/utils";
import Link from "next/link";

interface BrowserFrameProps {
  children: React.ReactNode;
  className?: string;
  domainPreview?: string;
  domain?: string;
}

export function BrowserFrame({
  children,
  className,
  domainPreview,
  domain,
}: BrowserFrameProps) {
  return (
    <div
      className={cn("overflow-hidden rounded-lg border shadow-xl", className)}
    >
      {/* Browser chrome/toolbar */}
      <div className="relative z-10 flex h-10 items-center gap-2 border-b bg-gray-100/80 px-4 backdrop-blur-sm dark:bg-gray-900/80">
        {/* Window controls */}
        <div className="flex gap-2">
          <div className="h-3 w-3 rounded-full bg-red-500/90" />
          <div className="h-3 w-3 rounded-full bg-yellow-500/90" />
          <div className="h-3 w-3 rounded-full bg-green-500/90" />
        </div>

        {/* URL bar */}
        <div className="ml-4 flex-1">
          <div className="flex h-6 items-center rounded-md bg-white/80 px-3 dark:bg-gray-800/80">
            <div className="flex-1">
              <Link target="_blank" href={domain ?? ""}>
                <p className="select-none text-xs text-gray-400">
                  {domainPreview || "nano-canvas.com"}
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="relative h-[calc(100%-40px)]">{children}</div>
    </div>
  );
}
