/**
 * Base interface for model inputs
 * All image models should extend this
 */
export interface ModelInput {
  prompt: string;
}

/**
 * Standard image generation input that most models support
 */
export interface ImageGenerationInput extends ModelInput {
  prompt: string;
  referenceImage?: string; // Base64 data URL or URL
  width?: number;
  height?: number;
  numOutputs?: number;
  outputFormat?: "webp" | "png" | "jpg";
}

/**
 * Prediction status and result from Replicate
 */
export interface Prediction {
  id: string;
  status: "starting" | "processing" | "succeeded" | "failed" | "canceled";
  output?: string[] | string;
  error?: string;
}

/**
 * Configuration for an image generation model on Replicate
 * Each model defines its own input type and how to map it to Replicate's format
 */
export interface ImageModelConfig<TInput extends ModelInput = ModelInput> {
  /** Display name for the model */
  name: string;
  /** Replicate model identifier (e.g., "black-forest-labs/flux-schnell") */
  modelId: string;
  /** Brief description of the model's characteristics */
  description: string;
  /** Map our standardized input to the model's specific input format */
  mapInput: (input: TInput) => Record<string, unknown>;
}


