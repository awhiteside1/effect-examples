import { Effect, Schema } from "effect";
import { StockPriceSchema } from "./StockPrice.ts";
import { AiChat, AiInput, AiToolkit } from "@effect/ai";

export class GetStockPrice extends Schema.TaggedRequest<GetStockPrice>()(
  "GetStockPrice",
  {
    success: StockPriceSchema,
    failure: Schema.Never,
    payload: {
      symbol: Schema.String.annotations({ description: "Stock ticker symbol" }),
    },
  },
  {
    description: "Get the previous day's stock price information for a given ticker symbol",
  },
) {}

export const stockTools = AiToolkit.empty.add(GetStockPrice);

export const StockToolsLive = stockTools.implement((handlers) =>
  handlers.handle("GetStockPrice", ({ symbol }) => {
    return Effect.promise(() =>
      fetch(
        `https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?adjusted=true&apiKey=oEIFHP8w7kAWWpUZczmlGQgS9CrZ3GZ2`,
      )
        .then((res) => res.json())
        .then((data) => {
          // The Polygon API returns results in an array
          const result = data.results[0];
          return StockPriceSchema.make({
            ticker: symbol,
            closePrice: result.c,
            openPrice: result.o,
            highPrice: result.h,
            lowPrice: result.l,
            volume: result.v,
            date: new Date(result.t).toISOString().split('T')[0],
          });
        })
    );
  })
);

export const queryStockPrice = Effect.gen(function* () {
  let input = AiInput.TextPart.fromContent(
    "What is the current stock price of AAPL?",
  );
  const chat = yield* AiChat.empty;
  const tools = yield* stockTools;
  let result: any;
  
  do {
    result = yield* chat.toolkit({
      required: false,
      input,
      tools,
    });
    //@ts-ignore
    input = result;
  } while(result.response.text.length === 0);

  const history = yield* chat.export;
  return result.response.text;
}).pipe(Effect.provide(StockToolsLive));

/**
 * Query stock price for a specific ticker symbol
 * @param symbol The stock ticker symbol (e.g., AAPL, MSFT, GOOGL)
 * @returns A text response with the stock price information
 */
export const queryStockPriceBySymbol = (symbol: string) => Effect.gen(function* () {
  let input = AiInput.TextPart.fromContent(
    `What is the current stock price of ${symbol}?`,
  );
  const chat = yield* AiChat.empty;
  const tools = yield* stockTools;
  let result: any;
  
  do {
    result = yield* chat.toolkit({
      required: false,
      input,
      tools,
    });
    //@ts-ignore
    input = result;
  } while(result.response.text.length === 0);

  const history = yield* chat.export;
  return result.response.text;
}).pipe(Effect.provide(StockToolsLive));
