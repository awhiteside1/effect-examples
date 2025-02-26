import { Effect, Schema } from "effect";
import { BlogPostSchema } from "./BlogPost.ts";
import { AiChat, AiInput, AiToolkit } from "@effect/ai";
import { dash } from "radashi";

class BlogPostResult extends BlogPostSchema.extend<BlogPostResult>(
	"BlogPostResult",
)({
	path: Schema.String.annotations({
		description:
			"Relative path this post is available on. Suitable for links. ",
	}),
}) {}

export class SearchBlogPosts extends Schema.TaggedRequest<SearchBlogPosts>()(
	"SearchBlogPosts",
	{
		success: Schema.Array(BlogPostResult),
		failure: Schema.Never,
		payload: {
			query: Schema.String.annotations({ description: "Query text string" }),
		},
	},
	{
		description:
			"Find all existing blog posts which include the given search query",
	},
) {}

const blogTools = AiToolkit.empty.add(SearchBlogPosts);

const BlogToolsLive = blogTools.implement((handlers) =>
	handlers.handle("SearchBlogPosts", ({ query }) => {
		return Effect.promise(() =>
			fetch(`https://dummyjson.com/posts/search?q=${query.substring(0, 2)}`)
				.then((res) => res.json())
				.then(
					(data: {
						posts: Array<{ title: string; body: string; tags: string[] }>;
					}) =>
						data.posts.slice(0, 5).map((blog) =>
							BlogPostResult.make({
								title: blog.title,
								path: dash(blog.title),
								description: blog.tags.join(", "),
								heroImageDescription: "a thing",
								content: blog.body,
							}),
						),
				),
		)
	}),
);

export const createBlogPost = Effect.gen(function* () {
	let input = AiInput.TextPart.fromContent(
		"What blog posts are there which invokve Fire? ",
	);
	const chat = yield* AiChat.empty;
	const tools = yield* blogTools;
	let result: any
	do {
		 result = yield* chat.toolkit({
			required: false,
			input,
			tools,
		});
		//@ts-ignore
		input = result
	}while(result.response.text.length === 0)

	const history = yield* chat.export;
	return result.response.text;
}).pipe(Effect.provide(BlogToolsLive));
