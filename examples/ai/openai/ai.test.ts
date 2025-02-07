import { Effect, Layer } from "effect";
import { assertExists } from "jsr:@std/assert";
import { createBlog } from "./BlogPost.ts";
import { chat } from "./chat.ts";
import { createClient } from "./client.ts";
import { createBlogPost } from "./tools.ts";
import { AiToolkit } from "@effect/ai";

Deno.test("chat", async () => {
  const program = Effect.provide(chat, createClient());
  const out = await Effect.runPromise(program);
  assertExists(out);
  console.log(out);
});

Deno.test("BlogPost", async () => {
  const program = Effect.provide(createBlog, createClient());
  const out = await Effect.runPromise(program);
  assertExists(out);
  console.log(out);
});

Deno.test.only("BlogPost client", async () => {
  const program = Effect.provide(createBlogPost, createClient()).pipe(Effect.provide(AiToolkit.Registry.Live));
  const out = await Effect.runPromise(program);
  assertExists(out);
  console.log(out);
});
