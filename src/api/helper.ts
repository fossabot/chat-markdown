import { Result } from "@swan-io/boxed"
import { parse, stringify } from "telejson"

import { ChatCompletionError, type EventSourceData, isChunk } from "../api/types"

const parseChunk = (chunk: string): Result<EventSourceData, Error> => {
    try {
        const jsonString = chunk
            .split("\n")
            .map((line) => line.replace(/^data: /u, ""))
            .join("")

        if (jsonString === "[DONE]") {
            return Result.Ok<EventSourceData>(jsonString)
        }

        const parsed: unknown = parse(jsonString)

        if (isChunk(parsed)) {
            return Result.Ok<EventSourceData>(parsed)
        }

        if (ChatCompletionError.is(parsed)) {
            return Result.Error(ChatCompletionError.from(parsed))
        }

        return Result.Error(new Error(`Unknown chunk: ${jsonString}`))
    } catch (error) {
        return Result.Error(new Error(stringify(error)))
    }
}

export const parseEventSource = (data: string) => {
    return data.split("\n\n").filter(Boolean).map(parseChunk)
}
