import { Result } from "@swan-io/boxed"

import { VITE_OPENAI_API_ENDPOINT } from "../env"
import type { ChatCompletionOptions, ChatMessage } from "./types"

export const getChatCompletionStream = async (
    apiKey: string,
    messages: ChatMessage[],
    options: ChatCompletionOptions,
    customHeaders?: Record<string, string>,
    signal: AbortSignal | null = null,
): Promise<Result<ReadableStream<Uint8Array>, Error>> => {
    const headers: HeadersInit = {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        ...customHeaders,
    }

    const response = await fetch(VITE_OPENAI_API_ENDPOINT, {
        signal,
        method: "POST",
        headers,
        body: JSON.stringify({
            messages,
            ...options,
            max_tokens: undefined,
            stream: true,
        }),
    })

    if (response.status === 403) {
        return Result.Error(new Error("Invalid API key"))
    }

    if (response.status === 429) {
        return Result.Error(new Error("Rate limit exceeded"))
    }

    if (!response.body) {
        return Result.Error(new Error("Response body is empty"))
    }

    return Result.Ok(response.body)
}
