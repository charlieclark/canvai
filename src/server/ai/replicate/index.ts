/**
 * Replicate Image Generation
 *
 * Usage:
 *
 * ```ts
 * import {
 *   startGeneration,
 *   getPrediction,
 *   runGeneration,
 *   fluxSchnell,
 *   fluxDev,
 * } from "@/server/ai/replicate";
 *
 * // Start async generation with Flux Schnell (default)
 * const prediction = await startGeneration(fluxSchnell, {
 *   prompt: "A beautiful sunset",
 *   width: 1024,
 *   height: 1024,
 * });
 *
 * // Or run synchronously (blocks until complete)
 * const result = await runGeneration(fluxDev, { prompt: "..." });
 * ```
 */

// Core client functions
export {
  startGeneration,
  getPrediction,
  waitForPrediction,
  runGeneration,
} from "./client";

// Types
export type {
  ModelInput,
  ImageGenerationInput,
  Prediction,
  ImageModelConfig,
} from "./types";

// Model configurations
export * from "./models";

