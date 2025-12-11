/**
 * Supported image generation providers
 */
export type ImageProvider = "fal" | "replicate";

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
  referenceImage?: string; // URL
  width?: number;
  height?: number;
  numOutputs?: number;
  outputFormat?: "webp" | "png" | "jpg";
}

/**
 * Prediction status and result (provider-agnostic)
 */
export interface Prediction {
  id: string;
  status: "starting" | "processing" | "succeeded" | "failed" | "canceled";
  output?: string[] | string;
  error?: string;
}

/**
 * Provider-specific model IDs
 */
export interface ProviderModelIds {
  fal?: string;
  replicate?: string;
}

/**
 * Configuration for an image generation model
 * Each model defines its own input type and how to map it to the provider's format
 */
export interface ImageModelConfig<TInput extends ModelInput = ModelInput> {
  /** Display name for the model */
  name: string;
  /** Provider-specific model identifiers */
  modelIds: ProviderModelIds;
  /** Brief description of the model's characteristics */
  description: string;
  /** Map our standardized input to the model's specific input format for each provider */
  mapInput: (input: TInput, provider: ImageProvider) => Record<string, unknown>;
}

