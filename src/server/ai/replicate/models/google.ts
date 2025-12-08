import type { ImageModelConfig, ImageGenerationInput } from "../types";
import { detectAspectRatio, detectResolution } from "@/lib/utils/image";

/**
 * Nano Banana Pro - Google's high-quality image generation
 * Best for: High quality outputs, production use
 */
export const nanoBananaPro: ImageModelConfig<ImageGenerationInput> = {
  name: "Nano Banana Pro",
  modelId: "google/nano-banana-pro",
  description: "Expensive but good",

  mapInput: (input) => {
    const aspectRatio = detectAspectRatio(input.width ?? 0, input.height ?? 0);
    const resolution = detectResolution(
      input.width ?? 0,
      input.height ?? 0,
      aspectRatio,
    );
    return {
      prompt: input.prompt,
      resolution: `${resolution}K`,
      image_input: input.referenceImage ? [input.referenceImage] : [],
      aspect_ratio: aspectRatio,
      output_format: input.outputFormat ?? "jpg",
    };
  },
};

export const imagenFast: ImageModelConfig<ImageGenerationInput> = {
  name: "Imagen 4 Fast",
  modelId: "google/imagen-4-fast",
  description: "Fast",

  mapInput: (input) => ({
    prompt: input.prompt,
    aspect_ratio: detectAspectRatio(input.width ?? 0, input.height ?? 0),
    output_format: input.outputFormat ?? "jpg",
    safety_filter_level: "block_only_high",
  }),
};
