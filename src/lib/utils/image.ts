export function convertAspectRatioString(ar: string) {
  const [w, h] = ar.split(":").map((n) => parseInt(n));
  return w! / h!;
}

/**
 * Resolution options for image generation
 * 1 = 1K (~1024px), 2 = 2K (~2048px)
 */
export type Resolution = 1 | 2;

export const RESOLUTIONS = [
  { value: 2 as Resolution, label: "2K (HD - Slower)", description: "~2048px" },
  { value: 1 as Resolution, label: "1K (SD - Faster)", description: "~1024px" },
] as const;

export const DEFAULT_RESOLUTION: Resolution = 2;

/**
 * Base aspect ratios (at 1x multiplier)
 * Use getGenerationDimensions() to get actual generation sizes
 */
const BASE_DIMENSIONS = {
  "1:1": { width: 1024, height: 1024 },
  "16:9": { width: 1344, height: 768 },
  "9:16": { width: 768, height: 1344 },
  "4:3": { width: 1152, height: 896 },
  "3:4": { width: 896, height: 1152 },
  "3:2": { width: 1216, height: 832 },
  "2:3": { width: 832, height: 1216 },
} as const;

/**
 * Predefined aspect ratios for display (uses 1x for canvas sizing)
 */
export const ASPECT_RATIOS = [
  {
    value: "1:1",
    label: "1:1",
    width: BASE_DIMENSIONS["1:1"].width,
    height: BASE_DIMENSIONS["1:1"].height,
  },
  {
    value: "16:9",
    label: "16:9",
    width: BASE_DIMENSIONS["16:9"].width,
    height: BASE_DIMENSIONS["16:9"].height,
  },
  {
    value: "9:16",
    label: "9:16",
    width: BASE_DIMENSIONS["9:16"].width,
    height: BASE_DIMENSIONS["9:16"].height,
  },
  {
    value: "4:3",
    label: "4:3",
    width: BASE_DIMENSIONS["4:3"].width,
    height: BASE_DIMENSIONS["4:3"].height,
  },
  {
    value: "3:4",
    label: "3:4",
    width: BASE_DIMENSIONS["3:4"].width,
    height: BASE_DIMENSIONS["3:4"].height,
  },
  // {
  //   value: "3:2",
  //   label: "3:2",
  //   width: BASE_DIMENSIONS["3:2"].width,
  //   height: BASE_DIMENSIONS["3:2"].height,
  // },
  // {
  //   value: "2:3",
  //   label: "2:3",
  //   width: BASE_DIMENSIONS["2:3"].width,
  //   height: BASE_DIMENSIONS["2:3"].height,
  // },
] as const;

/**
 * Get generation dimensions for an aspect ratio at a specific resolution
 */
export function getGenerationDimensions(
  aspectRatio: AspectRatio,
  resolution: Resolution = DEFAULT_RESOLUTION,
): { width: number; height: number } {
  const base = BASE_DIMENSIONS[aspectRatio];
  return {
    width: base.width * resolution,
    height: base.height * resolution,
  };
}

/**
 * Detect the resolution multiplier from actual frame dimensions
 * Compares against base dimensions to determine if 1K or 2K
 */
export function detectResolution(
  width: number,
  height: number,
  aspectRatio: AspectRatio,
): Resolution {
  const base = BASE_DIMENSIONS[aspectRatio];
  // Calculate the average multiplier from width and height
  const widthMultiplier = width / base.width;
  const heightMultiplier = height / base.height;
  const avgMultiplier = (widthMultiplier + heightMultiplier) / 2;
  
  // If closer to 2, use 2K; otherwise use 1K
  return avgMultiplier >= 1.5 ? 2 : 1;
}

export type AspectRatio = (typeof ASPECT_RATIOS)[number]["value"];

/**
 * Find the closest matching aspect ratio for given dimensions
 */
export function detectAspectRatio(width: number, height: number): AspectRatio {
  if (!width || !height) return "4:3";

  const frameRatio = width / height;

  let closest: AspectRatio = "1:1";
  let smallestDiff = Infinity;

  for (const ratio of ASPECT_RATIOS) {
    const targetRatio = ratio.width / ratio.height;
    const diff = Math.abs(frameRatio - targetRatio);
    if (diff < smallestDiff) {
      smallestDiff = diff;
      closest = ratio.value;
    }
  }

  return closest;
}
