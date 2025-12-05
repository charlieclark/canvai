import { type TRPCClientError } from "@trpc/client";
import { type AppRouter } from "@/server/api/root";
import { type typeToFlattenedError } from "zod";

type ZodFieldErrors = Record<string, string[] | undefined>;

export interface ErrorWithMessage {
  message: string;
  data?: {
    code?: string;
    zodError?: typeToFlattenedError<unknown, string> | null;
  } | null;
}

/**
 * Formats a Zod error message to be more user-friendly
 */
function formatZodError(
  zodError: typeToFlattenedError<unknown, string>,
): string {
  // Get the first field error
  const fieldErrors = zodError.fieldErrors as ZodFieldErrors;
  if (!fieldErrors || Object.keys(fieldErrors).length === 0) {
    return "Invalid input provided";
  }

  // Get the first error field and message
  const entries = Object.entries(fieldErrors) as [string, string[]][];

  if (!entries[0]) {
    return "Invalid input provided";
  }

  const [, errors] = entries[0];

  if (!errors || errors.length === 0) {
    return "Invalid input provided";
  }

  return errors.join(", ");
}

/**
 * Extracts a user-friendly error message from a TRPC error
 */
export function getUserErrorMessage(error: ErrorWithMessage): string {
  // Handle Zod validation errors
  if (error.data?.zodError) {
    return formatZodError(error.data.zodError);
  }

  // Handle other errors with a generic message in production
  if (process.env.NODE_ENV === "production") {
    return "An unexpected error occurred. Please try again later.";
  }

  // In development, return the actual error message
  return error.message;
}
