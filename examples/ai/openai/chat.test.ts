import { main } from "./chat.ts";

Deno.test("chat", async () => {
  await main();
});
