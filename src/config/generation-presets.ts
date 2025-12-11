/**
 * Style presets for image generation
 * Each style adds specific visual characteristics to the generated image
 */
export interface StylePreset {
  id: string;
  label: string;
  description: string;
  promptModifier: string;
}

export const STYLE_PRESETS: StylePreset[] = [
  {
    id: "auto",
    label: "Auto",
    description: "Automatically match the style from the reference",
    promptModifier:
      "Match and enhance the visual style present in the reference, maintaining consistency with its aesthetic. If there are multiple styles, pick the dominant style and apply it cohesively to all elements.",
  },
  {
    id: "cinematic",
    label: "Cinematic",
    description: "Movie-like dramatic lighting and atmosphere",
    promptModifier:
      "Cinematic lighting, dramatic atmosphere, movie scene aesthetic, professional photography",
  },
  {
    id: "anime",
    label: "Anime",
    description: "Japanese animation style with cel shading",
    promptModifier:
      "Anime style, Japanese animation aesthetic, cel shading, vibrant colors",
  },
  {
    id: "oil-painting",
    label: "Oil Painting",
    description: "Classical painting with textured brushstrokes",
    promptModifier:
      "Oil painting style, textured brushstrokes, classical art technique, rich colors",
  },
  {
    id: "pixel-art",
    label: "Pixel Art",
    description: "Retro 8-bit game graphics aesthetic",
    promptModifier:
      "Pixel art style, 8-bit aesthetic, retro game graphics, limited color palette",
  },
  {
    id: "watercolor",
    label: "Watercolor",
    description: "Soft washes and transparent layers",
    promptModifier:
      "Watercolor painting, soft washes, transparent layers, artistic flow",
  },
  {
    id: "3d-render",
    label: "3D Render",
    description: "Photorealistic CGI with volumetric lighting",
    promptModifier:
      "3D rendered, octane render, volumetric lighting, photorealistic CGI",
  },
  {
    id: "sketch",
    label: "Sketch",
    description: "Hand-drawn pencil illustration style",
    promptModifier:
      "Pencil sketch style, hand-drawn illustration, line art, graphite texture",
  },
  {
    id: "neon",
    label: "Neon",
    description: "Cyberpunk aesthetic with glowing colors",
    promptModifier:
      "Neon lights, cyberpunk aesthetic, glowing colors, dark background with bright accents",
  },
];

/**
 * Action presets modify how the AI processes the reference image
 * These are mutually exclusive - only one can be selected at a time
 */
export interface ActionPreset {
  id: string;
  label: string;
  description: string;
  promptPrefix: string;
  isDefault?: boolean;
}

export const DEFAULT_ACTION_ID = "transform-frame";

export const ACTION_PRESETS: ActionPreset[] = [
  {
    id: "transform-frame",
    label: "Auto",
    description: "Convert frame contents into a polished, cohesive image",
    promptPrefix: "",
    isDefault: true,
  },
  {
    id: "convert-sketch",
    label: "Convert Sketch",
    description: "Turn a rough sketch into a finished image",
    promptPrefix: "Convert this sketch into a fully rendered image.",
  },
  {
    id: "extend",
    label: "Extend Image",
    description: "Expand the image beyond its current boundaries",
    promptPrefix:
      "Extend and expand this image outward into the surrounding whitespace. Do not modify the original image, unless there are annotations.",
  },
  {
    id: "enhance",
    label: "Enhance Details",
    description: "Add more detail and refinement to the image",
    promptPrefix: "Enhance and add more detail to this image.",
  },
];

/**
 * Composition presets control how closely the generation follows the input
 * These are mutually exclusive - only one can be selected at a time
 */
export interface CompositionPreset {
  id: string;
  label: string;
  description: string;
  promptModifier: string;
  isDefault?: boolean;
}

export const DEFAULT_COMPOSITION_ID = "guided";

export const COMPOSITION_PRESETS: CompositionPreset[] = [
  {
    id: "strict",
    label: "Strict",
    description: "Match exact composition, layout, and positioning",
    promptModifier:
      "Strictly preserve the exact composition, layout, and positioning of all elements from the reference. Maintain the precise spatial relationships and arrangement.",
  },
  {
    id: "guided",
    label: "Guided",
    description: "Follow the layout but allow adjustments for visual cohesion",
    promptModifier:
      "Follow the general layout and composition from the reference, but make adjustments as needed for visual cohesion and quality.",
    isDefault: true,
  },
  {
    id: "inspired",
    label: "Inspired",
    description: "Use input as reference, prioritize natural/realistic output",
    promptModifier:
      "Use the reference as inspiration for the concept and elements, but prioritize generating a natural, realistic, and visually cohesive result over matching the exact layout.",
  },
  {
    id: "reimagine",
    label: "Reimagine",
    description: "Loose interpretation, maximum creative freedom",
    promptModifier:
      "Freely reimagine and interpret the concept from the reference. Take creative liberties with composition, layout, and arrangement to create the best possible image.",
  },
];

/**
 * Enhancement filters that can be toggled on/off
 * Multiple filters can be selected simultaneously
 */
export interface EnhancementFilter {
  id: string;
  label: string;
  description: string;
  promptModifier: string;
}

export const ENHANCEMENT_FILTERS: EnhancementFilter[] = [
  {
    id: "high-detail",
    label: "High Detail",
    description: "Add intricate details and fine textures",
    promptModifier: "highly detailed, intricate details, fine textures.",
  },
  {
    id: "sharp-focus",
    label: "Sharp Focus",
    description: "Crisp edges and high clarity",
    promptModifier: "sharp focus, crisp edges, high clarity.",
  },
  {
    id: "smooth-gradients",
    label: "Smooth Gradients",
    description: "Seamless color transitions",
    promptModifier: "smooth color gradients, seamless transitions.",
  },
  {
    id: "dramatic-lighting",
    label: "Dramatic Lighting",
    description: "Strong shadows and high contrast",
    promptModifier: "dramatic lighting, strong shadows, high contrast.",
  },
  {
    id: "soft-lighting",
    label: "Soft Lighting",
    description: "Gentle shadows and even illumination",
    promptModifier:
      "soft diffused lighting, gentle shadows, even illumination.",
  },
  {
    id: "vibrant-colors",
    label: "Vibrant Colors",
    description: "Saturated and bold color palette",
    promptModifier: "vibrant saturated colors, bold color palette.",
  },
  {
    id: "muted-tones",
    label: "Muted Tones",
    description: "Desaturated and subtle colors",
    promptModifier: "muted color palette, desaturated, subtle tones.",
  },
  {
    id: "depth-of-field",
    label: "Depth of Field",
    description: "Bokeh background blur effect",
    promptModifier: "shallow depth of field, bokeh background blur.",
  },
];

/**
 * Build the final prompt by combining user input with selected presets
 */
export function buildEnhancedPrompt({
  userPrompt,
  selectedAction,
  selectedComposition,
  selectedStyle,
  selectedFilters,
}: {
  userPrompt: string;
  selectedAction: string | null;
  selectedComposition: string | null;
  selectedStyle: string | null;
  selectedFilters: string[];
}): string {
  const parts: string[] = [];

  const extras = [
    "Remove any shapes, lines or text that are annotations.",
    "Ensure the generated image is cohesive and high quality.",
  ];

  // Add action prefix (always have one since transform-frame is default)
  const action = ACTION_PRESETS.find((a) => a.id === selectedAction);
  if (action) {
    parts.push(action.promptPrefix);
  }

  // Add composition modifier (controls fidelity to input)
  const composition = COMPOSITION_PRESETS.find(
    (c) => c.id === selectedComposition,
  );
  if (composition) {
    parts.push(composition.promptModifier);
  } else {
    // Fallback to Guided composition when none selected
    const guidedComposition = COMPOSITION_PRESETS.find(
      (c) => c.id === "guided",
    );
    if (guidedComposition) {
      parts.push(guidedComposition.promptModifier);
    }
  }

  // Add the user's main prompt if provided
  const trimmedPrompt = userPrompt.trim();
  if (trimmedPrompt) {
    parts.push(trimmedPrompt);
  }

  // Add style modifier (use Auto style as fallback if none selected)
  const style = STYLE_PRESETS.find((s) => s.id === selectedStyle);
  if (style) {
    parts.push(style.promptModifier);
  } else {
    // Fallback to Auto style when no style selected
    const autoStyle = STYLE_PRESETS.find((s) => s.id === "auto");
    if (autoStyle) {
      parts.push(autoStyle.promptModifier);
    }
  }

  // Add enhancement filter modifiers
  const filterModifiers = selectedFilters
    .map((id) => ENHANCEMENT_FILTERS.find((f) => f.id === id)?.promptModifier)
    .filter(Boolean);
  if (filterModifiers.length > 0) {
    parts.push(filterModifiers.join(", "));
  }

  return [...parts, ...extras].join(" ");
}
