import { cn } from "@/lib/utils";
import Link from "next/link";

interface BrowserFrameProps {
  children: React.ReactNode;
  className?: string;
  domainPreview?: string;
  domain?: string;
  variant?: "dark" | "light";
  size?: "default" | "small";
}

export function BrowserFrame({
  children,
  className,
  domainPreview,
  domain,
  variant = "light",
  size = "default",
}: BrowserFrameProps) {
  const isLight = variant === "light";
  const isSmall = size === "small";

  return (
    <div
      className={cn(
        "overflow-hidden border shadow-2xl backdrop-blur-sm",
        isSmall ? "rounded-lg" : "rounded-xl",
        isLight ? "border-gray-200 bg-white" : "border-white/10 bg-gray-900/80",
        className,
      )}
    >
      {/* Browser chrome/toolbar */}
      <div
        className={cn(
          "relative z-10 flex items-center border-b backdrop-blur-sm",
          isSmall ? "h-7 gap-1.5 px-2.5" : "h-10 gap-2 px-4",
          isLight
            ? "border-gray-200 bg-gray-100"
            : "border-white/10 bg-gray-900/90",
        )}
      >
        {/* Window controls */}
        <div className={cn("flex", isSmall ? "gap-1.5" : "gap-2")}>
          <div
            className={cn(
              "rounded-full bg-red-500/90",
              isSmall ? "h-2 w-2" : "h-3 w-3",
            )}
          />
          <div
            className={cn(
              "rounded-full bg-yellow-500/90",
              isSmall ? "h-2 w-2" : "h-3 w-3",
            )}
          />
          <div
            className={cn(
              "rounded-full bg-green-500/90",
              isSmall ? "h-2 w-2" : "h-3 w-3",
            )}
          />
        </div>

        {/* URL bar */}
        <div className={cn("flex-1", isSmall ? "ml-2.5" : "ml-4")}>
          <div
            className={cn(
              "flex items-center rounded-md",
              isSmall ? "h-4 px-2" : "h-6 px-3",
              isLight ? "bg-gray-200" : "bg-white/5",
            )}
          >
            <div className="flex-1">
              {domain ? (
                <Link target="_blank" href={domain}>
                  <p
                    className={cn(
                      "select-none transition-colors",
                      isSmall ? "text-[10px]" : "text-xs",
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
                    "select-none",
                    isSmall ? "text-[10px]" : "text-xs",
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
      <div
        className={cn(
          "relative",
          isSmall ? "h-[calc(100%-28px)]" : "h-[calc(100%-40px)]",
        )}
      >
        {children}
      </div>
    </div>
  );
}
