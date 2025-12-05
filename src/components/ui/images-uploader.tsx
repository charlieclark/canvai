"use client";

import { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { X, Loader2, Upload, GripVertical } from "lucide-react";
import { uploadImage } from "@/lib/utils/upload";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { nanoid } from "nanoid";
import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
  type DraggableProvided,
  type DraggableStateSnapshot,
} from "@hello-pangea/dnd";
import Image from "next/image";

interface ImageUploadProps {
  images: string[];
  onImagesChanged: (urls: string[]) => void;
  disabled?: boolean;
}

interface UploadingImage {
  id: string;
  file: File;
  preview: string;
  progress: number;
}

interface SortableImageProps {
  url: string;
  isLoading?: boolean;
  provided?: DraggableProvided;
  snapshot?: DraggableStateSnapshot;
  onRemove?: () => void;
}

function SortableImage({
  url,
  isLoading,
  provided,
  snapshot,
  onRemove,
}: SortableImageProps) {
  return (
    <div
      ref={provided?.innerRef}
      {...provided?.draggableProps}
      className={cn(
        "group relative mb-2 h-24 overflow-hidden rounded-lg border bg-white/50 transition-shadow",
        snapshot?.isDragging &&
          "z-50 bg-white shadow-lg ring-2 ring-indigo-500/30",
      )}
    >
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-black/50">
          <Loader2 className="h-6 w-6 animate-spin text-white" />
        </div>
      )}
      <div className="absolute inset-0">
        <Image src={url} alt="Uploaded" fill className="object-cover" />
      </div>
      <div className="absolute inset-0 flex items-center bg-gradient-to-r from-black/30 via-transparent to-black/30">
        <div
          {...provided?.dragHandleProps}
          className="cursor-grab p-4 text-white/70 hover:text-white active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4" />
        </div>
        <div className="flex-1" />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="mr-2 h-8 w-8 shrink-0 text-white/70 hover:bg-white/20 hover:text-white"
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

const ACCEPTED_IMAGE_TYPES = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function ImagesUploader({ images, onImagesChanged }: ImageUploadProps) {
  const { toast } = useToast();
  const [uploadingImages, setUploadingImages] = useState<UploadingImage[]>([]);

  // Cleanup object URLs when component unmounts
  useEffect(() => {
    return () => {
      uploadingImages.forEach((image) => {
        URL.revokeObjectURL(image.preview);
      });
    };
  }, [uploadingImages]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(images);
    const [reorderedItem] = items.splice(result.source.index, 1);
    if (!reorderedItem) return;

    items.splice(result.destination.index, 0, reorderedItem);
    onImagesChanged(items);
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!acceptedFiles.length) return;

      // Add new images to the uploading state with unique IDs
      const newImages = acceptedFiles.map((file) => ({
        id: nanoid(),
        file,
        preview: URL.createObjectURL(file),
        progress: 0,
      }));

      setUploadingImages((prev) => [...prev, ...newImages]);

      // Handle uploads in a separate async function
      const handleUploads = async () => {
        try {
          // Upload all images in parallel
          const uploadPromises = newImages.map(async (image) => {
            try {
              // Update progress for this specific image
              setUploadingImages((prev) =>
                prev.map((img) =>
                  img.id === image.id ? { ...img, progress: 33 } : img,
                ),
              );

              const url = await uploadImage(image.file);

              // Mark this image as completed
              setUploadingImages((prev) =>
                prev.map((img) =>
                  img.id === image.id ? { ...img, progress: 100 } : img,
                ),
              );

              return { id: image.id, url };
            } catch (error) {
              console.error(
                `Failed to upload image ${image.file.name}:`,
                error,
              );
              toast({
                title: "Error",
                description: `Failed to upload ${image.file.name}`,
                variant: "destructive",
              });
              // Remove this specific image from the list
              setUploadingImages((prev) =>
                prev.filter((img) => img.id !== image.id),
              );
              // Cleanup the preview URL
              URL.revokeObjectURL(image.preview);
              return null;
            }
          });

          const results = (await Promise.all(uploadPromises)).filter(
            (result): result is { id: string; url: string } => result !== null,
          );

          if (results.length > 0) {
            // Notify parent of successful uploads
            onImagesChanged([...images, ...results.map((r) => r.url)]);

            // Remove successfully uploaded images and cleanup their previews
            setUploadingImages((prev) => {
              const successfulIds = new Set(results.map((r) => r.id));
              const remainingImages = prev.filter(
                (img) => !successfulIds.has(img.id),
              );

              // Cleanup preview URLs for successful uploads
              prev
                .filter((img) => successfulIds.has(img.id))
                .forEach((img) => {
                  URL.revokeObjectURL(img.preview);
                });

              return remainingImages;
            });
          }
        } catch (error) {
          console.error("Failed to upload images:", error);
          toast({
            title: "Error",
            description: "Failed to upload images",
            variant: "destructive",
          });
          // Cleanup all preview URLs
          newImages.forEach((image) => {
            URL.revokeObjectURL(image.preview);
          });
          // Remove all uploading images
          setUploadingImages([]);
        }
      };

      // Start the upload process
      void handleUploads();
    },
    [images, onImagesChanged, toast],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_IMAGE_TYPES,
    maxSize: MAX_FILE_SIZE,
    onDropRejected: (fileRejections) => {
      fileRejections.forEach((rejection) => {
        const errors = rejection.errors.map((error) => {
          switch (error.code) {
            case "file-too-large":
              return "File is too large. Maximum size is 5MB";
            case "file-invalid-type":
              return "Invalid file type. Only JPEG, PNG and WebP images are allowed";
            default:
              return error.message;
          }
        });

        toast({
          title: "Error",
          description: `${rejection.file.name}: ${errors.join(", ")}`,
          variant: "destructive",
        });
      });
    },
  });

  // Remove uploaded image
  const removeUploadedImage = (url: string) => {
    onImagesChanged(images.filter((image) => image !== url));
  };

  // Remove uploading image
  const removeUploadingImage = (id: string) => {
    setUploadingImages((prev) => {
      const image = prev.find((img) => img.id === id);
      if (image) {
        URL.revokeObjectURL(image.preview);
      }
      return prev.filter((img) => img.id !== id);
    });
  };

  return (
    <div
      {...getRootProps()}
      className={cn(
        "space-y-4 transition-all",
        isDragActive && "bg-indigo-500/10",
      )}
    >
      {images.length > 0 && (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable
            droppableId="images"
            renderClone={(provided, snapshot, rubric) => {
              const image = images[rubric.source.index]!;
              return (
                <SortableImage
                  url={image}
                  provided={provided}
                  snapshot={snapshot}
                />
              );
            }}
          >
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2"
              >
                {images.map((url, index) => (
                  <Draggable key={url} draggableId={url} index={index}>
                    {(provided, snapshot) => (
                      <SortableImage
                        url={url}
                        provided={provided}
                        snapshot={snapshot}
                        onRemove={() => removeUploadedImage(url)}
                      />
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      {/* Currently Uploading Images */}
      {uploadingImages.map((image) => (
        <SortableImage
          key={image.id}
          url={image.preview}
          isLoading={image.progress > 0 && image.progress < 100}
          onRemove={() => removeUploadingImage(image.id)}
        />
      ))}

      {/* Upload prompt - only show if no images */}
      {images.length === 0 && uploadingImages.length === 0 && (
        <div className="border-muted-foreground/20 text-muted-foreground flex flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed py-3">
          <div className="flex items-center gap-2 text-sm">
            <Upload className="h-4 w-4" />
            {isDragActive
              ? "Drop images here"
              : "Drop images or click to upload"}
          </div>
          <p className="text-muted-foreground/70 text-xs">(max 5MB each)</p>
        </div>
      )}

      {/* Minimal upload prompt - show if has images */}
      {(images.length > 0 || uploadingImages.length > 0) && (
        <div className="text-muted-foreground/70 flex items-center justify-center gap-1 text-xs">
          <Upload className="h-3 w-3" />
          {isDragActive ? "Drop to add more" : "Drop to add more images"} (max
          5MB each)
        </div>
      )}
      <input {...getInputProps()} />
    </div>
  );
}
