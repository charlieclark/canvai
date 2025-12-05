/**
 * Model configurations for Replicate image generation
 *
 * To add a new model:
 * 1. Create a new file in this directory (e.g., sdxl.ts)
 * 2. Export model config(s) implementing ImageModelConfig
 * 3. Re-export from this index file
 */

export * from "./flux";

// Re-export for convenience
export { fluxSchnell as defaultModel } from "./flux";

