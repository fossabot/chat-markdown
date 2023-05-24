import { stringify } from "telejson"
import { z } from "zod"

export const ChatCompletionChunkSchema = z.object({
    id: z.string(),
    object: z.literal("chat.completion.chunk"),
    created: z.number(),
    model: z.string(),
    choices: z.array(
        z.object({
            delta: z.object({
                role: z.optional(z.string()),
                content: z.optional(z.string()),
            }),
            index: z.number(),
            finish_reason: z.null().or(z.string()),
        }),
    ),
})

export type ChatCompletionChunk = z.infer<typeof ChatCompletionChunkSchema>

export const isChunk = (value: unknown): value is ChatCompletionChunk => {
    return ChatCompletionChunkSchema.safeParse(value).success
}

export type EventSourceData = ChatCompletionChunk | "[DONE]"

export type Role = "user" | "assistant" | "system"

export type Model = "gpt-4" | "gpt-4-32k" | "gpt-3.5-turbo"

export type ChatMessage = {
    role: Role
    content: string
}

export type ChatCompletionOptions = {
    model: Model
    max_tokens: number
    temperature: number
    presence_penalty: number
    top_p: number
    frequency_penalty: number
}

export const ChatCompletionErrorSchema = z.object({
    message: z.string(),
    type: z.string(),
    param: z.string(),
    code: z.string(),
})

export class ChatCompletionError extends Error implements z.infer<typeof ChatCompletionErrorSchema> {
    type: string

    code: string

    param: string

    private constructor(message: string, type: string, code: string, param: string) {
        super(message)
        this.name = "ChatCompletionError"
        this.type = type
        this.code = code
        this.param = param
    }

    static is(value: unknown): value is ChatCompletionError {
        return ChatCompletionErrorSchema.safeParse(value).success
    }

    static from(value: unknown): ChatCompletionError {
        const result = ChatCompletionErrorSchema.safeParse(value)

        if (result.success) {
            return new ChatCompletionError(result.data.message, result.data.type, result.data.code, result.data.param)
        }

        return new ChatCompletionError(stringify(value), "unknown", "unknown", "unknown")
    }
}
