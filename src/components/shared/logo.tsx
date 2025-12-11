import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoMarkProps {
  variant?: "light" | "dark";
  className?: string;
}

export function LogoMark({ variant = "light", className }: LogoMarkProps) {
  return (
    <div className={cn("relative h-8 w-8", className)}>
      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#0066CC] to-[#F97316]" />
      <div
        className={cn(
          "absolute inset-[3px] rounded-md",
          variant === "light" ? "bg-white" : "bg-[#0f172b]",
        )}
      />
      <div className="absolute inset-[6px] rounded bg-gradient-to-br from-[#0066CC] to-[#F97316]" />
    </div>
  );
}

interface LogoTextProps {
  className?: string;
}

export function LogoText({ className }: LogoTextProps) {
  return (
    <span className={cn("text-xl font-semibold tracking-tight", className)}>
      <span className="bg-gradient-to-r from-[#0066CC] to-[#F97316] bg-clip-text text-transparent">
        CanvAi
      </span>
    </span>
  );
}

interface LogoProps {
  variant?: "light" | "dark";
  className?: string;
  href?: string;
  showMark?: boolean;
}

export function Logo({
  variant = "light",
  className,
  href = "/",
  showMark = true,
}: LogoProps) {
  return (
    <Link href={href} className={cn("flex items-center gap-2.5", className)}>
      {showMark && <LogoMark variant={variant} />}
      <LogoText />
    </Link>
  );
}



