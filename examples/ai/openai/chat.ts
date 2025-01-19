import { Console, Effect, Layer, Redacted } from "effect";

import { AiChat, AiInput, AiToolkit, Completions } from "@effect/ai";

import { TextPart } from "@effect/ai/AiInput";
export const chat = Effect.gen(function* () {
  const chat = yield* AiChat.empty;
  const response = yield* chat.send(
    TextPart.fromContent("Could you pass the salt?"),
  );
  return response.text;
});
