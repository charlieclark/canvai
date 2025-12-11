import { fal } from "@fal-ai/client";
import type { IImageGenerationProvider } from "./types";
import type { Prediction } from "../types";

/**
 * fal.ai image generation provider using the official @fal-ai/client
 * @see https://fal.ai/models/fal-ai/nano-banana-pro/edit/api
 */
export class FalProvider implements IImageGenerationProvider {
  constructor(apiToken: string) {
    // Configure the fal client with the API key
    fal.config({
      credentials: apiToken,
    });
  }

  async startGeneration(
    modelId: string,
    input: Record<string, unknown>,
  ): Promise<Prediction> {
    // Submit to the queue and get request_id
    const { request_id } = await fal.queue.submit(modelId, {
      input,
    });

    // Store modelId::requestId so we can poll later
    return {
      id: `${modelId}::${request_id}`,
      status: "starting",
    };
  }

  async getPrediction(id: string): Promise<Prediction> {
    const { modelId, requestId } = this.parseId(id);

    // Check the status - the fal client returns different shapes based on status
    const status = await fal.queue.status(modelId, {
      requestId,
      logs: false,
    });

    // Cast to get the status string for comparison
    const statusValue = status.status as string;

    if (statusValue === "COMPLETED") {
      // Fetch the actual result
      const result = await fal.queue.result(modelId, {
        requestId,
      });

      const output = this.extractOutput(result.data as FalImageResult);

      return {
        id,
        status: "succeeded",
        output,
      };
    }

    if (statusValue === "FAILED") {
      return {
        id,
        status: "failed",
        error: "Generation failed",
      };
    }

    return {
      id,
      status: this.mapStatusString(statusValue),
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

  private parseId(id: string): { modelId: string; requestId: string } {
    if (!id.includes("::")) {
      throw new Error(
        "Invalid fal.ai prediction ID format. Expected 'modelId::requestId'",
      );
    }

    const separatorIndex = id.lastIndexOf("::");
    const modelId = id.substring(0, separatorIndex);
    const requestId = id.substring(separatorIndex + 2);

    return { modelId, requestId };
  }

  private mapStatusString(falStatus: string): Prediction["status"] {
    switch (falStatus) {
      case "IN_QUEUE":
        return "starting";
      case "IN_PROGRESS":
        return "processing";
      case "COMPLETED":
        return "succeeded";
      case "FAILED":
        return "failed";
      default:
        return "processing";
    }
  }

  private extractOutput(result: FalImageResult): string[] | undefined {
    // Handle the images array from fal.ai response
    if (result.images && result.images.length > 0) {
      return result.images.map((img) => img.url);
    }
    // Fallback for single image response
    if (result.image) {
      return [result.image.url];
    }
    return undefined;
  }
}

/**
 * fal.ai image result schema
 */
interface FalImageResult {
  images?: Array<{
    url: string;
    content_type?: string;
    file_name?: string;
    width?: number;
    height?: number;
  }>;
  image?: {
    url: string;
  };
  description?: string;
}

/**
 * Create a fal.ai provider instance
 */
export function createFalProvider(apiToken: string): FalProvider {
  return new FalProvider(apiToken);
}

