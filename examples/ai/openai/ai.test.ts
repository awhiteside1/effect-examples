import {assertExists} from "jsr:@std/assert";
import { createBlog } from "./BlogPost.ts";
import { chat } from "./chat.ts";
import { createClient } from "./client.ts";
import { Effect } from "effect";

Deno.test("chat", async () => {
  const program = Effect.provide(chat, createClient());
  const out = await Effect.runPromise(program);
  assertExists(out)
  console.log(out)
});

Deno.test("BlogPost", async () => {
  const program = Effect.provide(createBlog, createClient());
  const out =await Effect.runPromise(program);
  assertExists(out)
  console.log(out)
});
