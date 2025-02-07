import { Effect, Layer, Schema } from "effect";
import { BlogPostSchema } from "./BlogPost.ts";
import { AiChat, AiToolkit } from "@effect/ai";
import { dash } from "radashi";
import { AiInput, Completions } from "@effect/ai";

class BlogPostResult
  extends BlogPostSchema.extend<BlogPostResult>("BlogPostResult")({
    path: Schema.String.annotations({
      description:
        "Relative path this post is available on. Suitable for links. ",
    }),
  }) {}

export class SearchBlogPosts
  extends Schema.TaggedRequest<SearchBlogPosts>()("SearchBlogPosts", {
    success: Schema.Array(
      BlogPostResult,
    ),
    failure: Schema.Never,
    payload: {
      query: Schema.String.annotations({ description: "Query text string" }),
    },
  }, {
    description:
      "Find all existing blog posts which include the given search query",
  }) {}

const blogTools = AiToolkit.empty.add(SearchBlogPosts);

const BlogToolsLive = blogTools.implement((handlers) =>
  // deno-lint-ignore require-yield
  Effect.gen(function* () {
    return handlers.handle(
      "SearchBlogPosts",
      ({ query }) =>
        Effect.promise(() =>
          fetch(`https://dummyjson.com/posts/search?q=${query}`).then((res) =>
            res.json()
          ).then((
              data:{posts: Array<{ title: string; body: string; tags: string[] }>},
          ) =>
            data.posts.map((blog) =>
              BlogPostResult.make({
                title: blog.title,
                path: dash(blog.title),
                description: blog.tags.join(", "),
                heroImageDescription: "a thing",
                content: blog.body,
              })
            )
          )
        ),
    );
  })
);

export const createBlogPost = Effect.gen(function* () {
  const input = AiInput.TextPart.fromContent(
    "Types vs interfaces in typescript",
  );

  const chat = yield* AiChat.empty.pipe(AiInput.provideSystem(
    "You are a technical author and professional software engineer who writes high quality blog posts based on a subject given by the user, and work in any details they provide in addition to your own content. Make sure to reference other posts by link already on the blog within the body oontent.   ",
  ));

  const tools = yield* blogTools;

  const result = yield* chat.toolkit({
    input,
    tools,
  });

  return result.value;
}).pipe(Effect.provide(BlogToolsLive));
