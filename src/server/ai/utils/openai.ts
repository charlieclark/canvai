import OpenAI from "openai";
import { env } from "@/env";

export const openAIclient = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

export function extractResponseJson<T>(response: string) {
  const trimmedResponse = response.match(/({[^}]*})/gim)?.[0];
  if (!trimmedResponse) {
    throw new Error("invalid response");
  }
  return JSON.parse(trimmedResponse) as T;
}
