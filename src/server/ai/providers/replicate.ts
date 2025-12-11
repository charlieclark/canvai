import Replicate from "replicate";
import type { IImageGenerationProvider } from "./types";
import type { Prediction } from "../types";

/**
 * Replicate image generation provider
 */
export class ReplicateProvider implements IImageGenerationProvider {
  private client: Replicate;

  constructor(apiToken: string) {
    this.client = new Replicate({
      auth: apiToken,
    });
  }

  async startGeneration(
    modelId: string,
    input: Record<string, unknown>,
  ): Promise<Prediction> {
    const prediction = await this.client.predictions.create({
      model: modelId,
      input,
    });

    return {
      id: prediction.id,
      status: prediction.status as Prediction["status"],
      output: prediction.output as string[] | undefined,
      error: prediction.error as string | undefined,
    };
  }

  async getPrediction(id: string): Promise<Prediction> {
    const prediction = await this.client.predictions.get(id);

    return {
      id: prediction.id,
      status: prediction.status as Prediction["status"],
      output: prediction.output as string[] | undefined,
      error: prediction.error as string | undefined,
    };
  }

  async waitForPrediction(
    id: string,
    maxWaitMs = 120000,
    pollIntervalMs = 1000,
  ): Promise<Prediction> {
    const startTime = Date.now();

    while (Date.now() - startTime < maxWaitMs) {
      const prediction = await this.getPrediction(id);

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
}

/**
 * Create a Replicate provider instance
 */
export function createReplicateProvider(apiToken: string): ReplicateProvider {
  return new ReplicateProvider(apiToken);
}

