import type { ImageModelConfig, ImageGenerationInput } from "../types";

/**
 * Flux Schnell - Fast generation, good quality
 * Best for: Quick iterations, prototyping
 */
export const fluxSchnell: ImageModelConfig<ImageGenerationInput> = {
  name: "Flux Schnell",
  modelId: "black-forest-labs/flux-schnell",
  description: "Fast generation with good quality. Best for quick iterations.",
  mapInput: (input) => ({
    prompt: input.prompt,
    ...(input.referenceImage && { image: input.referenceImage }),
    ...(input.width && { width: input.width }),
    ...(input.height && { height: input.height }),
    num_outputs: input.numOutputs ?? 1,
    output_format: input.outputFormat ?? "jpg",
    output_quality: 90,
  }),
};

/**
 * Flux Dev - Higher quality, slower generation
 * Best for: Final outputs, when quality matters most
 */
export const fluxDev: ImageModelConfig<ImageGenerationInput> = {
  name: "Flux Dev",
  modelId: "black-forest-labs/flux-dev",
  description: "Higher quality generation. Best for final outputs.",
  mapInput: (input) => ({
    prompt: input.prompt,
    ...(input.referenceImage && { image: input.referenceImage }),
    ...(input.width && { width: input.width }),
    ...(input.height && { height: input.height }),
    num_outputs: input.numOutputs ?? 1,
    output_format: input.outputFormat ?? "jpg",
    output_quality: 90,
    guidance: 3.5,
    num_inference_steps: 28,
  }),
};

/**
 * Flux Pro 1.1 - Production quality
 * Best for: Professional use, highest quality outputs
 */
export const fluxPro: ImageModelConfig<ImageGenerationInput> = {
  name: "Flux Pro 1.1",
  modelId: "black-forest-labs/flux-1.1-pro",
  description: "Production-grade quality. Best for professional outputs.",
  mapInput: (input) => ({
    prompt: input.prompt,
    ...(input.width && { width: input.width }),
    ...(input.height && { height: input.height }),
    output_format: input.outputFormat ?? "jpg",
    safety_tolerance: 2,
  }),
};

