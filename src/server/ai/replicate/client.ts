import Replicate from "replicate";
import { env } from "@/env";
import type { ImageModelConfig, ModelInput, Prediction } from "./types";

/**
 * Replicate API client singleton
 */
export const replicate = new Replicate({
  auth: env.REPLICATE_API_TOKEN,
});

/**
 * Start an image generation using the specified model configuration
 */
export async function startGeneration<T extends ModelInput>(
  model: ImageModelConfig<T>,
  input: T,
): Promise<Prediction> {
  const replicateInput = model.mapInput(input);

  const prediction = await replicate.predictions.create({
    model: model.modelId,
    input: replicateInput,
  });

  return {
    id: prediction.id,
    status: prediction.status as Prediction["status"],
    output: prediction.output as string[] | undefined,
    error: prediction.error as string | undefined,
  };
}

/**
 * Get the status of a prediction by ID
 */
export async function getPrediction(id: string): Promise<Prediction> {
  const prediction = await replicate.predictions.get(id);

  return {
    id: prediction.id,
    status: prediction.status as Prediction["status"],
    output: prediction.output as string[] | undefined,
    error: prediction.error as string | undefined,
  };
}

/**
 * Wait for a prediction to complete (with timeout)
 */
export async function waitForPrediction(
  id: string,
  maxWaitMs = 120000,
  pollIntervalMs = 1000,
): Promise<Prediction> {
  const startTime = Date.now();

  while (Date.now() - startTime < maxWaitMs) {
    const prediction = await getPrediction(id);

    if (
      prediction.status === "succeeded" ||
      prediction.status === "failed" ||
      prediction.status === "canceled"
    ) {
      return prediction;
    }

    await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
  }

  throw new Error("Generation timed out");
}

/**
 * Run a synchronous generation (start + wait for completion)
 */
export async function runGeneration<T extends ModelInput>(
  model: ImageModelConfig<T>,
  input: T,
): Promise<Prediction> {
  const prediction = await startGeneration(model, input);
  return waitForPrediction(prediction.id);
}

