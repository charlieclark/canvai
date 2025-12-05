/**
 * Convert a string to a URL-friendly slug
 * Preserves trailing hyphens for better UX when editing
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove non-word chars except hyphens
    .replace(/[\s_]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+/g, "") // Remove leading hyphens only
    .replace(/-{2,}/g, "-"); // Replace multiple consecutive hyphens with a single hyphen
} 