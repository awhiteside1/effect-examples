import {Schema} from 'effect'


import {Effect} from'effect'
import { AiChat, AiInput, AiToolkit, Completions } from "@effect/ai";

export const createBlog = Effect.gen(function* () {
    const completions = yield* Completions.Completions.pipe(AiInput.provideSystem(
        "You are a technical author and professional sofrware engineer who writes high quality blog posts based on a subject given by the user, and work in any details they provide in addition to your own content.   ",
    ));
    const input = AiInput.TextPart.fromContent(
        "Types vs interfaces in typescript",
    );
    const result = yield* completions.structured({
        input,
        schema: BlogPostSchema,
    });
    return yield* result.value;

});


 class BlogPostSchema extends Schema.Class<BlogPostSchema>("BlogPostSchema")(
    {

        title: Schema.String.annotations({
            description: "A short, catchy title for the post",
        }),
        description: Schema.String.annotations({
            description: "1-2 sentences that give an overview or a highlight of the post, shown under the title. ",
        }),
        heroImageDescription: Schema.String.annotations({description:'A text description of a relevant hero image for the post.'}),
        content: Schema.String.annotations({
            description: "The body of the blog post, as markdown text.",
        }),
    },
    {
        description: "A  post for a forward thinking software architecture blog. ",
    },
) {}