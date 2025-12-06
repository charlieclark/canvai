export function convertAspectRatioString(ar: string) {
  const [w, h] = ar.split(":").map((n) => parseInt(n));
  return w! / h!;
}

/**
 * Predefined aspect ratios with their generation dimensions
 */
export const MULTIPLIER = 1;
export const ASPECT_RATIOS = [
  {
    value: "1:1",
    label: "1:1 (Square)",
    width: 1024 * MULTIPLIER,
    height: 1024 * MULTIPLIER,
  },
  {
    value: "16:9",
    label: "16:9 (Landscape)",
    width: 1344 * MULTIPLIER,
    height: 768 * MULTIPLIER,
  },
  {
    value: "9:16",
    label: "9:16 (Portrait)",
    width: 768 * MULTIPLIER,
    height: 1344 * MULTIPLIER,
  },
  {
    value: "4:3",
    label: "4:3 (Standard)",
    width: 1152 * MULTIPLIER,
    height: 896 * MULTIPLIER,
  },
  {
    value: "3:4",
    label: "3:4 (Portrait)",
    width: 896 * MULTIPLIER,
    height: 1152 * MULTIPLIER,
  },
  {
    value: "3:2",
    label: "3:2 (Photo)",
    width: 1216 * MULTIPLIER,
    height: 832 * MULTIPLIER,
  },
  {
    value: "2:3",
    label: "2:3 (Portrait Photo)",
    width: 832 * MULTIPLIER,
    height: 1216 * MULTIPLIER,
  },
] as const;

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
