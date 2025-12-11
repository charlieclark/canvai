/**
 * Image Generation Module
 *
 * Supports multiple providers (fal.ai, Replicate) with a unified interface.
 * The provider can be configured via the IMAGE_PROVIDER environment variable.
 *
 * Usage:
 *
 * ```ts
 * import {
 *   startGeneration,
 *   getPrediction,
 *   runGeneration,
 *   nanoBananaPro,
 *   imagenFast,
 *   getDefaultProvider,
 * } from "@/server/ai";
 *
 * // Start async generation with the default provider
 * const prediction = await startGeneration(nanoBananaPro, {
 *   prompt: "A beautiful sunset",
 *   width: 1024,
 *   height: 1024,
 * }, apiToken);
 *
 * // Or specify a provider explicitly
 * const prediction = await startGeneration(nanoBananaPro, {
 *   prompt: "A beautiful sunset",
 *   width: 1024,
 *   height: 1024,
 * }, apiToken, "replicate");
 *
 * // Run synchronously (blocks until complete)
 * const result = await runGeneration(imagenFast, { prompt: "..." }, apiToken);
 * ```
 */

// Core client functions
export {
  startGeneration,
  getPrediction,
  waitForPrediction,
  runGeneration,
  getDefaultProvider,
  createProvider,
  DEFAULT_PROVIDER,
} from "./client";

// Types
export type {
  ModelInput,
  ImageGenerationInput,
  Prediction,
  ImageModelConfig,
  ImageProvider,
  ProviderModelIds,
} from "./types";

// Provider types
export type { IImageGenerationProvider } from "./providers";

// Model configurations
export * from "./models";

