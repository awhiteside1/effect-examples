import {OpenAiClient, OpenAiCompletions} from "@effect/ai-openai";
import {FetchHttpClient} from "@effect/platform";
import {Layer, Redacted} from "effect";

export const createClient = () => {
  const apiKey = Deno.env.get("OPENAI_API_KEY");
  if (!apiKey) throw new Error("API key is missing");
  const ClientLive = OpenAiClient.layer({ apiKey: Redacted.make(apiKey) }).pipe(
      Layer.provide(FetchHttpClient.layer),
  );
  return  OpenAiCompletions.layer({ model: "gpt-4o-mini" })
      .pipe(Layer.provide(ClientLive));

};
