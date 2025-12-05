import { cn } from "@/lib/utils";
import Image from "next/image";

interface DotPatternProps {
  className?: string;
}

export function DotPattern({ className }: DotPatternProps) {
  return (
    <div className="absolute inset-0 -z-10 w-full overflow-hidden">
      {/* <Image
        src="/marketing/gradient-0.png"
        alt="Background gradient"
        fill
        priority
        className="scale-110 object-fill object-center blur-xl"
        sizes="100vw"
        quality={90}
      /> */}
      <div className="absolute inset-0 bg-background/90" />
      <div
        className={cn(
          "w-ful absolute inset-0 h-full opacity-20",
          "[background-image:radial-gradient(#000000_0.5px,transparent_0.5px)]",
          "[background-size:16px_16px]",
          "[background-position:center_center]",
          "[background-repeat:repeat]",
        )}
      />
    </div>
  );
}
