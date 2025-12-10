import type { Prediction } from "../types";

/**
 * Interface for image generation providers
 * Both fal.ai and Replicate implement this interface
 */
export interface IImageGenerationProvider {
  /** Start an async image generation */
  startGeneration(
    modelId: string,
    input: Record<string, unknown>,
  ): Promise<Prediction>;

  /** Get the status of a generation by ID */
  getPrediction(id: string): Promise<Prediction>;

  /** Wait for a prediction to complete (with timeout) */
  waitForPrediction(
    id: string,
    maxWaitMs?: number,
    pollIntervalMs?: number,
  ): Promise<Prediction>;
}

/**
 * Factory function type for creating providers
 */
export type ProviderFactory = (apiToken: string) => IImageGenerationProvider;
