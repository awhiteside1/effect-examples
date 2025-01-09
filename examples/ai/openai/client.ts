import { OpenAiClient } from "@effect/ai-openai";
import { Layer, Redacted } from "effect";
import { HttpClient } from "@effect/platform";
export const createClient = (): Layer.Layer<
  OpenAiClient.OpenAiClient,
  never,
  HttpClient.HttpClient
> => {
  const apiKey = Deno.env.get("OPENAI_API_KEY");
  if (!apiKey) throw new Error("API key is missing");
  return OpenAiClient.layer({ apiKey: Redacted.make(apiKey) });
};
