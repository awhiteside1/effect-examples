import { Effect, Layer, Logger } from "effect";
import { assertExists } from "jsr:@std/assert";
import { createBlog } from "./BlogPost.ts";
import { chat } from "./chat.ts";
import { createClient } from "./client.ts";
import { createBlogPost } from "./tools.ts";
import { queryStockPrice, queryStockPriceBySymbol } from "./stockTools.ts";
import { DevTools } from "npm:@effect/experimental";
import { NodeRuntime, NodeSocket } from "npm:@effect/platform-node";

Deno.test("chat", async () => {
	const program = Effect.provide(chat, createClient());
	const out = await Effect.runPromise(program);
	assertExists(out);
	console.log(out);
});

Deno.test("StockPriceBySymbol", async () => {
	const DevToolsLive = DevTools.layerWebSocket().pipe(
		Layer.provide(NodeSocket.layerWebSocketConstructor),
	);
	const EnvLive = createClient().pipe(Layer.provide(DevToolsLive));

	// Test with Microsoft stock
	const program = queryStockPriceBySymbol("MSFT").pipe(Effect.provide(EnvLive));
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

Deno.test("BlogPost client", async () => {
	const DevToolsLive = DevTools.layerWebSocket().pipe(
		Layer.provide(NodeSocket.layerWebSocketConstructor),
	);
	const EnvLive = createClient().pipe(Layer.provide(DevToolsLive));

	const program = createBlogPost.pipe(Effect.provide(EnvLive));
	const out = await Effect.runPromise(program);
	assertExists(out);
	console.log(out);
});

Deno.test("StockPrice", async () => {
	const DevToolsLive = DevTools.layerWebSocket().pipe(
		Layer.provide(NodeSocket.layerWebSocketConstructor),
	);
	const EnvLive = createClient().pipe(Layer.provide(DevToolsLive));

	const program = queryStockPrice.pipe(Effect.provide(EnvLive));
	const out = await Effect.runPromise(program);
	assertExists(out);
	console.log(out);
});
