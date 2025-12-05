import Replicate from "replicate";
import { env } from "@/env";

const replicate = new Replicate({
  auth: env.REPLICATE_API_TOKEN,
});

// Flux Schnell is fast, Flux Dev is higher quality
const FLUX_MODEL = "black-forest-labs/flux-schnell";

export interface FluxGenerationInput {
  prompt: string;
  referenceImage?: string; // Base64 data URL or URL
  width?: number;
  height?: number;
  numOutputs?: number;
  outputFormat?: "webp" | "png" | "jpg";
}

export interface FluxPrediction {
  id: string;
  status: "starting" | "processing" | "succeeded" | "failed" | "canceled";
  output?: string[];
  error?: string;
}

/**
 * Start a Flux image generation
 * Returns the prediction ID for polling
 */
export async function startFluxGeneration(
  input: FluxGenerationInput,
): Promise<FluxPrediction> {
  const prediction = await replicate.predictions.create({
    model: FLUX_MODEL,
    input: {
      prompt: input.prompt,
      ...(input.referenceImage && { image: input.referenceImage }),
      ...(input.width && { width: input.width }),
      ...(input.height && { height: input.height }),
      num_outputs: input.numOutputs ?? 1,
      output_format: input.outputFormat ?? "webp",
      output_quality: 90,
    },
  });

  return {
    id: prediction.id,
    status: prediction.status as FluxPrediction["status"],
    output: prediction.output as string[] | undefined,
    error: prediction.error as string | undefined,
  };
}

/**
 * Get the status of a prediction
 */
export async function getFluxPrediction(id: string): Promise<FluxPrediction> {
  const prediction = await replicate.predictions.get(id);

  return {
    id: prediction.id,
    status: prediction.status as FluxPrediction["status"],
    output: prediction.output as string[] | undefined,
    error: prediction.error as string | undefined,
  };
}

/**
 * Wait for a prediction to complete (with timeout)
 */
export async function waitForFluxGeneration(
  id: string,
  maxWaitMs = 120000,
  pollIntervalMs = 1000,
): Promise<FluxPrediction> {
  const startTime = Date.now();

  while (Date.now() - startTime < maxWaitMs) {
    const prediction = await getFluxPrediction(id);

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
 * Run a synchronous generation (start + wait)
 */
export async function runFluxGeneration(
  input: FluxGenerationInput,
): Promise<FluxPrediction> {
  const prediction = await startFluxGeneration(input);
  return waitForFluxGeneration(prediction.id);
}


