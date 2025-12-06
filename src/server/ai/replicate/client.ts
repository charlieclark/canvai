import Replicate from "replicate";
import type { ImageModelConfig, ModelInput, Prediction } from "./types";

/**
 * Create a Replicate client with the given API token
 */
export function createReplicateClient(apiToken: string): Replicate {
  return new Replicate({
    auth: apiToken,
  });
}

/**
 * Start an image generation using the specified model configuration
 * Requires an API token to be passed
 */
export async function startGeneration<T extends ModelInput>(
  model: ImageModelConfig<T>,
  input: T,
  apiToken: string,
): Promise<Prediction> {
  const replicate = createReplicateClient(apiToken);
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
 * Requires an API token to be passed
 */
export async function getPrediction(
  id: string,
  apiToken: string,
): Promise<Prediction> {
  const replicate = createReplicateClient(apiToken);
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
 * Requires an API token to be passed
 */
export async function waitForPrediction(
  id: string,
  apiToken: string,
  maxWaitMs = 120000,
  pollIntervalMs = 1000,
): Promise<Prediction> {
  const startTime = Date.now();

  while (Date.now() - startTime < maxWaitMs) {
    const prediction = await getPrediction(id, apiToken);

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
 * Requires an API token to be passed
 */
export async function runGeneration<T extends ModelInput>(
  model: ImageModelConfig<T>,
  input: T,
  apiToken: string,
): Promise<Prediction> {
  const prediction = await startGeneration(model, input, apiToken);
  return waitForPrediction(prediction.id, apiToken);
}

