import type { ImageModelConfig, ImageGenerationInput } from "../types";
import { detectAspectRatio, detectResolution } from "@/lib/utils/image";

/**
 * Nano Banana Pro - Google's high-quality image generation
 * Best for: High quality outputs, production use
 */
export const nanoBananaPro: ImageModelConfig<ImageGenerationInput> = {
  name: "Nano Banana Pro",
  modelIds: {
    fal: "fal-ai/nano-banana-pro/edit",
    replicate: "google/nano-banana-pro",
  },
  description: "Expensive but good",

  mapInput: (input, provider) => {
    const aspectRatio = detectAspectRatio(input.width ?? 0, input.height ?? 0);
    const resolution = detectResolution(
      input.width ?? 0,
      input.height ?? 0,
      aspectRatio,
    );

    if (provider === "fal") {
      return {
        prompt: input.prompt,
        resolution: `${resolution}K`,
        image_urls: input.referenceImage ? [input.referenceImage] : undefined,
        aspect_ratio: aspectRatio,
        output_format: input.outputFormat ?? "jpeg",
      };
    }

    // Replicate format
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
  modelIds: {
    fal: "fal-ai/imagen4/fast",
    replicate: "google/imagen-4-fast",
  },
  description: "Fast",

  mapInput: (input, provider) => {
    const aspectRatio = detectAspectRatio(input.width ?? 0, input.height ?? 0);

    if (provider === "fal") {
      return {
        prompt: input.prompt,
        aspect_ratio: aspectRatio,
        output_format: input.outputFormat ?? "jpeg",
        safety_tolerance: "5", // fal.ai uses string values
      };
    }

    // Replicate format
    return {
      prompt: input.prompt,
      aspect_ratio: aspectRatio,
      output_format: input.outputFormat ?? "jpg",
      safety_filter_level: "block_only_high",
    };
  },
};
