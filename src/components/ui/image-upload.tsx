import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Image as ImageIcon, Loader2, X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { uploadImage } from "@/lib/utils/upload";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export interface ImageUploadProps {
  value?: string | null;
  onChange: (value: string) => void;
  onRemove: () => void;
  className?: string;
  variant?: "rectangular" | "circular" | "logo" | "header";
  size?: "sm" | "md" | "lg";
  label?: string;
}

const sizeClasses = {
  sm: {
    container: "h-24 w-24",
    icon: "h-6 w-6",
  },
  md: {
    container: "h-48 w-48",
    icon: "h-8 w-8",
  },
  lg: {
    container: "h-64 w-64",
    icon: "h-10 w-10",
  },
} as const;

export function ImageUpload({
  value,
  onChange,
  onRemove,
  className,
  variant = "rectangular",
  size = "md",
  label = "Image",
}: ImageUploadProps) {
  const isSquareVariant = variant === "circular" || variant === "logo";
  const [isUploading, setIsUploading] = useState(false);

  const getContainerClassName = () => {
    if (variant === "header") {
      return "aspect-[4/1] w-full";
    }
    if (variant === "rectangular") {
      return "aspect-video w-full";
    }
    return sizeClasses[size].container;
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      void (async () => {
        try {
          setIsUploading(true);
          const url = await uploadImage(file);
          setIsUploading(false);
          onChange(url);
        } catch (error) {
          console.error("Error uploading file:", error);
          toast.error("Failed to upload image");
        }
      })();
    },
    [onChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDropRejected: (rejectedFiles) => {
      const error = rejectedFiles[0]?.errors[0];
      const message = (() => {
        if (error?.code === "file-too-large") {
          return "Upload too large. Please upload a file under 5MB.";
        }
        return error?.message || "There was a problem uploading your file";
      })();
      toast.error(message);
    },
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    },
    maxFiles: 1,
    multiple: false,
    maxSize: 5242880,
  });

  const handleRemove = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    onRemove();
  };

  return (
    <div className={cn(isSquareVariant && "flex justify-center", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "group relative cursor-pointer transition-colors",
          isDragActive && "bg-muted/50",
        )}
      >
        <input {...getInputProps()} />
        {value ? (
          <div className={cn("group relative", getContainerClassName())}>
            <div
              className={cn(
                "absolute inset-0 overflow-hidden",
                variant === "circular" && "rounded-full",
                (variant === "logo" ||
                  variant === "rectangular" ||
                  variant === "header") &&
                  "rounded-lg",
              )}
            >
              <Image
                src={value}
                alt="Uploaded image"
                fill
                className={cn(
                  "object-contain",
                  variant === "circular" && "rounded-full",
                )}
              />
            </div>
            <div className="absolute -top-3 -right-3 z-10">
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="bg-background hover:bg-background/90 h-6 w-6 rounded-full shadow-md"
                onClick={handleRemove}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ) : (
          <div
            className={cn(
              "flex items-center justify-center border border-dashed transition-colors",
              isDragActive && "border-muted-foreground/50 bg-muted",
              variant === "circular" && "rounded-full",
              (variant === "logo" ||
                variant === "rectangular" ||
                variant === "header") &&
                "rounded-lg",
              getContainerClassName(),
            )}
          >
            <div className="text-muted-foreground flex flex-col items-center gap-2 text-sm">
              {isUploading ? (
                <Loader2
                  className={cn("animate-spin", sizeClasses[size].icon)}
                />
              ) : (
                <>
                  <ImageIcon className={sizeClasses[size].icon} />
                  <div className="text-center">
                    <p>Upload {label}</p>
                  </div>
                  <div className="text-center text-xs">
                    <p>File must be under 5MB</p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
