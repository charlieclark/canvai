import { customAlphabet } from "nanoid";

// Create a custom nanoid function that uses only lowercase letters and numbers
const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 6);

export function generateUniqueSlug(prefix = ""): string {
  const randomId = nanoid();
  return `${prefix}${prefix ? "-" : ""}${randomId}`;
}

function isBlacklisted(slug: string) {
  return ["www"].includes(slug);
}

export async function getUniqueSlugNew(
  baseSlug: string,
  getter: (slug: string) => Promise<boolean>,
) {
  const exists = isBlacklisted(baseSlug) || (await getter(baseSlug));

  if (exists) {
    return generateUniqueSlug(baseSlug);
  }

  return baseSlug;
}
