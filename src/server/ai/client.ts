import type {
  ImageProvider,
  ImageModelConfig,
  ModelInput,
  Prediction,
} from "./types";
import {
  createFalProvider,
  createReplicateProvider,
  type IImageGenerationProvider,
} from "./providers";

/**
 * Default provider - can be overridden via environment variable
 */
export const DEFAULT_PROVIDER: ImageProvider = "fal";

/**
 * Get the configured provider from environment
 */
export function getDefaultProvider(): ImageProvider {
  const envProvider = process.env.IMAGE_PROVIDER?.toLowerCase();
  if (envProvider === "fal" || envProvider === "replicate") {
    return envProvider;
  }
  return DEFAULT_PROVIDER;
}

/**
 * Create a provider instance based on type and API token
 */
export function createProvider(
  provider: ImageProvider,
  apiToken: string,
): IImageGenerationProvider {
  switch (provider) {
    case "fal":
      return createFalProvider(apiToken);
    case "replicate":
      return createReplicateProvider(apiToken);
    default: {
      const exhaustiveCheck: never = provider;
      throw new Error(`Unknown provider: ${exhaustiveCheck as string}`);
    }
  }
}

/**
 * Get the model ID for a specific provider
 */
function getModelId<T extends ModelInput>(
  model: ImageModelConfig<T>,
  provider: ImageProvider,
): string {
  const modelId = model.modelIds[provider];
  if (!modelId) {
    throw new Error(
      `Model "${model.name}" does not support provider "${provider}"`,
    );
  }
  return modelId;
}

/**
 * Start an image generation using the specified model configuration
 * @param model - The model configuration
 * @param input - The generation input
 * @param apiToken - The API token for the provider
 * @param provider - The provider to use (defaults to configured default)
 */
export async function startGeneration<T extends ModelInput>(
  model: ImageModelConfig<T>,
  input: T,
  apiToken: string,
  provider: ImageProvider = getDefaultProvider(),
): Promise<Prediction> {
  const providerInstance = createProvider(provider, apiToken);
  const modelId = getModelId(model, provider);
  const mappedInput = model.mapInput(input, provider);

  const prediction = await providerInstance.startGeneration(modelId, mappedInput);

  // For fal.ai, we need to store the model ID with the request ID for polling
  if (provider === "fal") {
    return {
      ...prediction,
      id: `${modelId}::${prediction.id}`,
    };
  }

  return prediction;
}

/**
 * Get the status of a prediction by ID
 * @param id - The prediction ID
 * @param apiToken - The API token for the provider
 * @param provider - The provider to use (defaults to configured default)
 */
export async function getPrediction(
  id: string,
  apiToken: string,
  provider: ImageProvider = getDefaultProvider(),
): Promise<Prediction> {
  const providerInstance = createProvider(provider, apiToken);
  return providerInstance.getPrediction(id);
}

/**
 * Wait for a prediction to complete (with timeout)
 * @param id - The prediction ID
 * @param apiToken - The API token for the provider
 * @param provider - The provider to use (defaults to configured default)
 * @param maxWaitMs - Maximum time to wait in milliseconds
 * @param pollIntervalMs - Polling interval in milliseconds
 */
export async function waitForPrediction(
  id: string,
  apiToken: string,
  provider: ImageProvider = getDefaultProvider(),
  maxWaitMs = 120000,
  pollIntervalMs = 1000,
): Promise<Prediction> {
  const providerInstance = createProvider(provider, apiToken);
  return providerInstance.waitForPrediction(id, maxWaitMs, pollIntervalMs);
}

/**
 * Run a synchronous generation (start + wait for completion)
 * @param model - The model configuration
 * @param input - The generation input
 * @param apiToken - The API token for the provider
 * @param provider - The provider to use (defaults to configured default)
 */
export async function runGeneration<T extends ModelInput>(
  model: ImageModelConfig<T>,
  input: T,
  apiToken: string,
  provider: ImageProvider = getDefaultProvider(),
): Promise<Prediction> {
  const prediction = await startGeneration(model, input, apiToken, provider);
  return waitForPrediction(prediction.id, apiToken, provider);
}

