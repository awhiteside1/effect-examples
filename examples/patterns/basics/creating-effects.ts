import { Console, Effect, Schedule } from "effect";
import { uid } from "radashi";
const createId = () => Effect.succeed(uid(5));
const createCustomId = (num: number) => Effect.succeed(uid(num));

class TooLongError extends Error {}

const checkId = (id: string) =>
  id.length > 5 ? Effect.fail(new TooLongError()) : Effect.succeed(id);

export const createAndCheckIdWithGenerators = Effect.gen(function* () {
  const id = yield* createId();
  const output = yield* checkId(id);
  Console.log(`Valid ID: ${output} `);
  return output;
});

export const createAndCheckIDWithDo = Effect.Do.pipe(
  createId,
  Effect.andThen(checkId),
  Effect.tapBoth({
    onFailure: (e) => Console.log(`Failed because of ${e}`),
    onSuccess: (a) => Console.log(`Success after ${a}`),
  }),
);

export const createCustomIDWithDo = (length: number) =>
  Effect.succeed(length).pipe(
    Effect.andThen(createCustomId),
    Effect.andThen(checkId),
    Effect.tapBoth({
      onFailure: (e) => Console.log(`Failed because of ${e}`),
      onSuccess: (a) => Console.log(`Success after ${a}`),
    }),
  );

export const retryUntilSuccessful = (length: number) => {
  const task = Effect.gen(function* () {
    const newLength = length--;
    return yield* createCustomIDWithDo(newLength);
  });
  return Effect.retry(task, Schedule.fixed("100 millis"));
};
