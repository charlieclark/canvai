import { cn } from "@/lib/utils";
import Link from "next/link";

interface BrowserFrameProps {
  children: React.ReactNode;
  className?: string;
  domainPreview?: string;
  domain?: string;
  variant?: "dark" | "light";
}

export function BrowserFrame({
  children,
  className,
  domainPreview,
  domain,
  variant = "light",
}: BrowserFrameProps) {
  const isLight = variant === "light";

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border shadow-2xl backdrop-blur-sm",
        isLight ? "border-gray-200 bg-white" : "border-white/10 bg-gray-900/80",
        className,
      )}
    >
      {/* Browser chrome/toolbar */}
      <div
        className={cn(
          "relative z-10 flex h-10 items-center gap-2 border-b px-4 backdrop-blur-sm",
          isLight
            ? "border-gray-200 bg-gray-100"
            : "border-white/10 bg-gray-900/90",
        )}
      >
        {/* Window controls */}
        <div className="flex gap-2">
          <div className="h-3 w-3 rounded-full bg-red-500/90" />
          <div className="h-3 w-3 rounded-full bg-yellow-500/90" />
          <div className="h-3 w-3 rounded-full bg-green-500/90" />
        </div>

        {/* URL bar */}
        <div className="ml-4 flex-1">
          <div
            className={cn(
              "flex h-6 items-center rounded-md px-3",
              isLight ? "bg-gray-200" : "bg-white/5",
            )}
          >
            <div className="flex-1">
              {domain ? (
                <Link target="_blank" href={domain}>
                  <p
                    className={cn(
                      "select-none text-xs transition-colors",
                      isLight
                        ? "text-gray-400 hover:text-gray-600"
                        : "text-white/40 hover:text-white/60",
                    )}
                  >
                    {domainPreview || "canvai.co"}
                  </p>
                </Link>
              ) : (
                <p
                  className={cn(
                    "select-none text-xs",
                    isLight ? "text-gray-400" : "text-white/40",
                  )}
                >
                  {domainPreview || "canvai.co"}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="relative h-[calc(100%-40px)]">{children}</div>
    </div>
  );
}
