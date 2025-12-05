import { shuffle } from "lodash";

// Normalize hex color to ensure valid 6-character format
export function normalizeHexColor(hex: string): string {
  // Remove hash if present
  hex = hex.replace("#", "");
  
  // Handle 3-character hex
  if (hex.length === 3) {
    return "#ffffff";
  }
  
  // Truncate if longer than 6 characters
  if (hex.length > 6) {
    return "#ffffff";
  }
  
  // Pad if shorter than 6 characters
  while (hex.length < 6) {
    return "#ffffff";
  }
  
  return `#${hex}`;
}

// Convert hex to RGB
export function hexToRgb(hex: string): [number, number, number] {
  // Normalize the hex color first
  hex = normalizeHexColor(hex);
  
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    console.warn(`Invalid hex color: ${hex}, falling back to white`);
    return [255, 255, 255];
  }
  return [
    parseInt(result[1]!, 16),
    parseInt(result[2]!, 16),
    parseInt(result[3]!, 16),
  ];
}

// Convert RGB to hex
export function rgbToHex(r: number, g: number, b: number): string {
  return `#${Math.round(r).toString(16).padStart(2, "0")}${Math.round(g)
    .toString(16)
    .padStart(2, "0")}${Math.round(b).toString(16).padStart(2, "0")}`;
}

// Interpolate between two colors
export function interpolateColor(
  backgroundColor: string,
  foregroundColor: string,
  progress: number,
): string {
  const rgb1 = hexToRgb(backgroundColor);
  const rgb2 = hexToRgb(foregroundColor);

  const r = rgb1[0] + (rgb2[0] - rgb1[0]) * progress;
  const g = rgb1[1] + (rgb2[1] - rgb1[1]) * progress;
  const b = rgb1[2] + (rgb2[2] - rgb1[2]) * progress;

  return rgbToHex(r, g, b);
}

interface RGB {
  r: number;
  g: number;
  b: number;
}

// Calculate color distance (in RGB space)
function colorDistance(backgroundColor: RGB, foregroundColor: RGB): number {
  const rDiff = backgroundColor.r - foregroundColor.r;
  const gDiff = backgroundColor.g - foregroundColor.g;
  const bDiff = backgroundColor.b - foregroundColor.b;
  return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
}

// Convert RGB to HSL
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  return [h * 360, s * 100, l * 100];
}

// Check if a color is grayscale (R,G,B values are very close to each other)
function isGrayscale(r: number, g: number, b: number, tolerance = 5): boolean {
  return Math.abs(r - g) <= tolerance && 
         Math.abs(g - b) <= tolerance && 
         Math.abs(r - b) <= tolerance;
}

// Get color of a region using a sampling approach
function getSampleColors(
  data: Uint8ClampedArray,
  startIdx: number,
  length: number,
): RGB[] {
  const colors: RGB[] = [];
  const step = 4; // Sample every nth pixel
  let grayscaleCount = 0;
  let totalSamples = 0;

  // First pass to detect if image is primarily black and white
  for (let i = startIdx; i < startIdx + length; i += step * 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    if (typeof r === "number" && typeof g === "number" && typeof b === "number") {
      totalSamples++;
      if (isGrayscale(r, g, b)) {
        grayscaleCount++;
      }
    }
  }

  const isBlackAndWhite = grayscaleCount / totalSamples > 0.9; // 90% of pixels are grayscale

  // Second pass to collect colors
  for (let i = startIdx; i < startIdx + length; i += step * 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    if (typeof r === "number" && typeof g === "number" && typeof b === "number") {
      const [hue, sat, light] = rgbToHsl(r, g, b);
      
      if (isBlackAndWhite) {
        // For black and white images, accept all grayscale values within a reasonable lightness range
        if (isGrayscale(r, g, b) && light >= 5 && light <= 95) {
          colors.push({ r, g, b });
        }
      } else {
        // For color images, use original criteria but with slightly relaxed saturation requirement
        if (sat > 10 && light >= 25 && light <= 90) {
          colors.push({ r, g, b });
        }
      }
    }
  }

  return colors;
}

// Extract dominant colors from an image
export async function extractColors(img: HTMLImageElement): Promise<string[]> {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  // Scale down image for faster processing
  const ar = img.naturalWidth / img.naturalHeight;
  canvas.width = 100;
  canvas.height = canvas.width / ar;

  // Draw image and get data
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Collect colors from the entire image
  const allColors: Array<{ color: RGB; hsl: [number, number, number] }> = [];

  // Sample colors from different regions
  const numRegions = 5;
  const regionSize = Math.floor(data.length / numRegions);

  // Check if image is primarily black and white
  let totalGrayscalePixels = 0;
  let totalPixels = 0;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (typeof r === "number" && typeof g === "number" && typeof b === "number") {
      totalPixels++;
      if (isGrayscale(r, g, b)) {
        totalGrayscalePixels++;
      }
    }
  }

  const isBlackAndWhite = totalGrayscalePixels / totalPixels > 0.9;

  for (let i = 0; i < data.length; i += regionSize) {
    const length = Math.min(regionSize, data.length - i);
    const colors = getSampleColors(data, i, length);
    
    for (const color of colors) {
      const hsl = rgbToHsl(color.r, color.g, color.b);
      allColors.push({ color, hsl });
    }
  }

  // For black and white images, return a light and medium-light color
  if (isBlackAndWhite) {
    const selectedColors: RGB[] = [];
    
    // Sort by lightness
    const sortedByLightness = allColors.sort((a, b) => {
      const [, , lightA] = a.hsl;
      const [, , lightB] = b.hsl;
      return lightB - lightA; // Sort by descending lightness
    });

    // Select a light and medium-light color
    const lightColors = sortedByLightness.filter(c => c.hsl[2] >= 75);
    const mediumLightColors = sortedByLightness.filter(c => c.hsl[2] >= 60 && c.hsl[2] < 75);

    if (lightColors.length) selectedColors.push(lightColors[0]!.color);
    if (mediumLightColors.length) selectedColors.push(mediumLightColors[0]!.color);

    // Fill remaining slot if needed
    while (selectedColors.length < 2 && sortedByLightness.length > 0) {
      selectedColors.push(sortedByLightness[0]!.color);
      sortedByLightness.shift();
    }

    return selectedColors.map(color => rgbToHex(color.r, color.g, color.b));
  }

  // Group colors by hue sections (60° segments for broader groups)
  const hueGroups = new Map<number, Array<{ color: RGB; hsl: [number, number, number] }>>();
  
  for (const colorData of allColors) {
    const [hue] = colorData.hsl;
    const hueSection = Math.floor(hue / 60); // 60° segments
    
    if (!hueGroups.has(hueSection)) {
      hueGroups.set(hueSection, []);
    }
    hueGroups.get(hueSection)?.push(colorData);
  }

  // Sort hue groups by size (most common hues first)
  const sortedHueGroups = Array.from(hueGroups.entries())
    .sort(([, a], [, b]) => b.length - a.length);

  const selectedColors: RGB[] = [];

  // First pass: select the lightest color from the most prominent hue group
  for (const [, colors] of sortedHueGroups) {
    if (selectedColors.length >= 1) break;

    // Sort colors in this hue group by lightness and saturation
    const sortedColors = colors.sort((a, b) => {
      const [, satA, lightA] = a.hsl;
      const [, satB, lightB] = b.hsl;
      
      // Score heavily favoring lighter colors with some consideration for saturation
      const scoreA = lightA * 0.7 + satA * 0.3;
      const scoreB = lightB * 0.7 + satB * 0.3;
      
      return scoreB - scoreA;
    });

    if (sortedColors.length > 0) {
      const candidate = sortedColors[0]!;
      if (candidate.hsl[2] >= 70) { // Must be quite light
        selectedColors.push(candidate.color);
      }
    }
  }

  // Second pass: select a color from a different hue group
  // Filter out hue groups that are too close to the first color
  if (selectedColors.length > 0) {
    const [firstHue] = rgbToHsl(selectedColors[0]!.r, selectedColors[0]!.g, selectedColors[0]!.b);
    const firstHueSection = Math.floor(firstHue / 60);

    const remainingGroups = sortedHueGroups.filter(([section]) => {
      const hueDiff = Math.abs(section - firstHueSection);
      return hueDiff >= 2 || hueDiff <= 4; // Ensure colors are distinctly different
    });

    for (const [, colors] of remainingGroups) {
      if (selectedColors.length >= 2) break;

      const sortedColors = colors.sort((a, b) => {
        const [, satA, lightA] = a.hsl;
        const [, satB, lightB] = b.hsl;
        
        const scoreA = lightA * 0.7 + satA * 0.3;
        const scoreB = lightB * 0.7 + satB * 0.3;
        
        return scoreB - scoreA;
      });

      if (sortedColors.length > 0) {
        const candidate = sortedColors[0]!;
        if (candidate.hsl[2] >= 65) { // Slightly lower lightness threshold for second color
          selectedColors.push(candidate.color);
        }
      }
    }
  }

  // If we still need the second color, use the best remaining light color
  if (selectedColors.length < 2) {
    const remainingColors = allColors
      .filter(({ color }) => !selectedColors.some(
        selected => selected.r === color.r && selected.g === color.g && selected.b === color.b
      ))
      .sort((a, b) => {
        const [, satA, lightA] = a.hsl;
        const [, satB, lightB] = b.hsl;
        
        const scoreA = lightA * 0.8 + satA * 0.2;
        const scoreB = lightB * 0.8 + satB * 0.2;
        
        return scoreB - scoreA;
      });

    while (selectedColors.length < 2 && remainingColors.length > 0) {
      const candidate = remainingColors.shift()!;
      if (candidate.hsl[2] >= 60) { // Lower threshold for final selection
        selectedColors.push(candidate.color);
      }
    }

    // Final fallback if needed
    while (selectedColors.length < 2) {
      const baseColor = selectedColors[0]!;
      selectedColors.push({
        r: Math.min(255, baseColor.r + 30),
        g: Math.min(255, baseColor.g + 30),
        b: Math.min(255, baseColor.b + 30),
      });
    }
  }

  return selectedColors.map(color => rgbToHex(color.r, color.g, color.b));
}
