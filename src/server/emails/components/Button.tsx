import { Button as ButtonRaw } from "@react-email/components";
import { cn } from "@/lib/utils";
export default function Button({
  children,
  href,
  className,
}: {
  children: React.ReactNode;
  href: string;
  className?: string;
}) {
  return (
    <ButtonRaw
      className={cn(
        "box-border w-full rounded-[8px] bg-indigo-600 px-[12px] py-[12px] text-center font-semibold text-white",
        className,
      )}
      href={href}
    >
      {children}
    </ButtonRaw>
  );
}
