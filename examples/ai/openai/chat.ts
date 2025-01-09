import { Console, Effect, Layer } from "effect";
import {
  OpenAiClient,
  OpenAiCompletions,
  OpenAiConfig,
} from "@effect/ai-openai";
import { AiChat, AiInput, AiToolkit } from "@effect/ai";
import { FetchHttpClient, HttpClient } from "@effect/platform";
import { createClient } from "./client.ts";
import { TextPart } from "@effect/ai/AiInput";
const chat = Effect.gen(function* () {
  const chat = yield* AiChat.empty;
  const response = yield* chat.send(TextPart.fromContent("Hi, I'm looking for a boat to take the family out in the gulf. Needs to seat 7, have a bathroom, and drag a wake board.  "));
  Console.log(response.text)
  return response;
});

export const main = async () => {
  const instruction =  AiInput.provideSystem('You are the customer service associate for a marine and boating store in cedar key, FL. We have only fishing boats and small craft in stock, so help the customer find the right boat for them. If the customer wants to place an order, you should invoke the order tool.')

  const Completions = OpenAiCompletions.layer({ model: "gpt-4o-mini" });
  const Client = Layer.provide(createClient(), FetchHttpClient.layer);
  const deps = Layer.provide(Completions,Client)
  const program = chat.pipe(Effect.provide(deps), instruction);
  const out = await Effect.runPromise(program);
  return out
};
