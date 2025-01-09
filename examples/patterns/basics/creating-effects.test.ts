import { Effect } from "effect";
import { assert, assertRejects, assertThrows } from "@std/assert";
import {
  createAndCheckIDWithDo,
  createAndCheckIdWithGenerators,
  createCustomIDWithDo, retryUntilSuccessful,
} from "./creating-effects.ts";

Deno.test("createAndCheckIdWithGenerators", async () => {
  const output = await Effect.runPromise(createAndCheckIdWithGenerators);
  assert(typeof output === "string");
});
Deno.test("createAndCheckIDWithDo", async () => {
  const output = await Effect.runPromise(createAndCheckIDWithDo);
  assert(typeof output === "string");
});

Deno.test("createAndCheckIDWithDo", () => {
  assertRejects(() => Effect.runPromise(createCustomIDWithDo(12)));
});
Deno.test("createAndCheckIDWithDo (Length 3)", async () => {
  const output = await Effect.runPromise(createCustomIDWithDo(3));
  assert(typeof output === "string");
});

Deno.test("retryUntilSuccessful", async ()=>{
  const output = await Effect.runPromise(retryUntilSuccessful(7))
  assert(typeof output === "string");
})