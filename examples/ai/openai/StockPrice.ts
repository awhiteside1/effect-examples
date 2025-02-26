import { AiInput, Completions } from "@effect/ai";
import { Effect, Schema } from "effect";

export class StockPriceSchema extends Schema.Class<StockPriceSchema>("StockPriceSchema")(
  {
    ticker: Schema.String.annotations({
      description: "The stock ticker symbol",
    }),
    closePrice: Schema.Number.annotations({
      description: "The closing price of the stock",
    }),
    openPrice: Schema.Number.annotations({
      description: "The opening price of the stock",
    }),
    highPrice: Schema.Number.annotations({
      description: "The highest price of the stock for the day",
    }),
    lowPrice: Schema.Number.annotations({
      description: "The lowest price of the stock for the day",
    }),
    volume: Schema.Number.annotations({
      description: "The trading volume for the day",
    }),
    date: Schema.String.annotations({
      description: "The date of the stock data",
    }),
  },
  {
    description: "Stock price information for a specific ticker symbol",
  },
) {}
