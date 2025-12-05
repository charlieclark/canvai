import normalizeUrl from "normalize-url";
import isURL from "validator/lib/isURL";
import { z } from "zod";

export const linkSchema = z.string().transform((url, ctx) => {
  try {
    const normalizedUrl = normalizeUrl(url, {
      defaultProtocol: "https",
      stripHash: true,
      stripWWW: false,
      removeTrailingSlash: true,
      removeQueryParameters: false,
    });
    if (!isURL(normalizedUrl)) {
      throw new Error("Invalid URL");
    }
    return normalizedUrl;
  } catch (err) {
    console.error(err);
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please enter a valid URL",
    });
    return z.NEVER;
  }
});
