import {AiChat} from "@effect/ai";

import {AiInput} from "@effect/ai";
import {Effect} from "effect";

export const chat = Effect.gen(function* () {
  const chat = yield* AiChat.empty;
  const response = yield* chat.send(
      AiInput.TextPart.fromContent("Could you pass the salt?"),
  );
  return response.text;
});
