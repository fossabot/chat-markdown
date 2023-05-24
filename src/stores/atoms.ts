import { Array as A, Dict, Option as O } from "@swan-io/boxed"
import { consola } from "consola"
import { get, set } from "idb-keyval"
import type { Draft } from "immer"
import { produce } from "immer"
import { atom, getDefaultStore, useAtom } from "jotai"
import { atomWithImmer } from "jotai-immer"
import { omit, pick } from "rambda"
import { useMemo } from "react"
import { from, map, mergeMap } from "rxjs"
import { stringify } from "telejson"
import invariant from "tiny-invariant"

import { getChatCompletionStream } from "../api/client"
import { parseEventSource } from "../api/helper"
import { configManager } from "../config"
import { readerToObservable } from "../lib/stream"
import type { Pretty } from "../lib/utilityTypes"
import { UUIDStamp } from "../lib/uuid"
import { DEFAULT_APP_LAYOUT, DEFAULT_SYSTEM_MESSAGE, EMPTY_CHAT_ITEM } from "./constants"
import type { AppLayout, ChatItem, MessageItem } from "./types"

const store = getDefaultStore()

export const appLayoutAtom = atomWithImmer(DEFAULT_APP_LAYOUT)

export const setAppLayout = (mutator: (draft: Draft<AppLayout>) => void) => {
    store.set(appLayoutAtom, mutator)
}

export const apiKeyAtom = atom("", (_, set, payload: string) => {
    const val = payload.trim()
    set(apiKeyAtom, val)
    void configManager.setConfig("apiKey", val)
})

export const emptyChatAtom = atom(() => EMPTY_CHAT_ITEM)

export const chatMapAtom = atomWithImmer<Record<UUIDStamp, ChatItem>>({})

store.sub(chatMapAtom, () => {
    void set("chatMapAtom", store.get(chatMapAtom))
})

export const messageMapAtom = atomWithImmer<Record<UUIDStamp, MessageItem>>({})

store.sub(messageMapAtom, () => {
    void set("messageMapAtom", store.get(messageMapAtom))
})

export const chatSummariesAtom = atom((get) => {
    return Dict.values(get(chatMapAtom)).map(pick(["id", "title"]))
})

export const messageSummariesAtom = atom((get) => {
    return Dict.values(get(messageMapAtom)).map(pick(["id", "Role"]))
})

export const addChatAtom = atom(null, (_, set, payload: ChatItem) => {
    const preCreatedMessage: MessageItem = {
        id: UUIDStamp(),
        role: "system",
        content: DEFAULT_SYSTEM_MESSAGE,
    }

    set(messageMapAtom, (draft) => {
        draft[preCreatedMessage.id] = preCreatedMessage
    })

    set(chatMapAtom, (draft) => {
        draft[payload.id] = payload
        draft[payload.id]?.messages.push(preCreatedMessage.id)
    })
})

export const removeChatAtom = atom(null, (_, set, id: UUIDStamp) => {
    set(
        chatMapAtom,
        produce((draft) => Reflect.deleteProperty(draft, id)),
    )
})

export const updateChatAtom = atom(null, (_, set, id: UUIDStamp, mutator: (draft: ChatItem) => void) => {
    set(chatMapAtom, (draft) => {
        const chat = draft[id]
        invariant(chat, "chat should exist")
        void mutator(chat)
    })
})

export const addMessageAtom = atom(null, (_, set, payload: MessageItem) => {
    set(messageMapAtom, (draft) => {
        draft[payload.id] = payload
    })
})

export const removeMessageAtom = atom(null, (_, set, id: UUIDStamp) => {
    set(messageMapAtom, (draft) => {
        Reflect.deleteProperty(draft, id)
    })
})

export const activeChatIDAtom = atom(UUIDStamp())

store.sub(activeChatIDAtom, () => {
    void set("activeChatIDAtom", store.get(activeChatIDAtom))
})

export const useChat = (id: UUIDStamp) => {
    return useAtom(useMemo(() => atom((get) => get(chatMapAtom)[id] ?? get(emptyChatAtom)), [id]))
}

export const useMessage = (id: UUIDStamp) => {
    return useAtom(useMemo(() => atom((get) => get(messageMapAtom)[id]), [id]))
}

export const loadDBToAtom = async () => {
    const chatMap = await get<Record<UUIDStamp, ChatItem>>("chatMapAtom")
    const messageMap = await get<Record<UUIDStamp, MessageItem>>("messageMapAtom")

    if (!chatMap || !messageMap) {
        return
    }

    store.set(chatMapAtom, chatMap)
    store.set(messageMapAtom, messageMap)

    const activeChatID = await get<UUIDStamp>("activeChatIDAtom")

    if (!activeChatID) {
        return
    }

    store.set(activeChatIDAtom, activeChatID)
}

export const loadConfigToAtom = async () => {
    const config = await configManager.loadConfig()
    if (config.isOk()) {
        const { apiKey } = config.get()
        store.set(apiKeyAtom, apiKey)
        return
    }
    await configManager.resetConfig()
}

export type ChatCompletionTaskMeta = {
    id: UUIDStamp
    chatID: UUIDStamp
    generatingMessageID: UUIDStamp
}

export type ChatCompletionTask =
    | Pretty<
          {
              type: "pending"
              abort: () => void
          } & ChatCompletionTaskMeta
      >
    | Pretty<
          {
              type: "done"
              content: string
          } & ChatCompletionTaskMeta
      >
    | Pretty<
          {
              type: "error"
              error: Error
          } & ChatCompletionTaskMeta
      >

export const chatCompletionTaskAtom = atom(O.None<ChatCompletionTask>())

export const requestChatCompletionAtom = atom(null, async (get, set, id: UUIDStamp) => {
    const chat = get(chatMapAtom)[id]

    if (!chat) {
        return
    }

    const messages: Omit<MessageItem, "id">[] = A.filterMap(chat.messages, (id) => {
        return O.fromNullable(get(messageMapAtom)[id]).map(omit(["id"]))
    })

    const abortController = new AbortController()

    const taskMeta: ChatCompletionTaskMeta = {
        id: UUIDStamp(),
        chatID: id,
        generatingMessageID: UUIDStamp(),
    }

    const message: MessageItem = {
        id: taskMeta.generatingMessageID,
        content: "",
        role: "assistant",
    }

    set(messageMapAtom, (draft) => {
        draft[taskMeta.generatingMessageID] = message
    })

    set(chatMapAtom, (draft) => {
        draft[id]?.messages.push(taskMeta.generatingMessageID)
    })

    set(
        chatCompletionTaskAtom,
        O.Some<ChatCompletionTask>({
            ...taskMeta,
            type: "pending",
            abort: () => {
                abortController.abort()
            },
        }),
    )

    const apiKey = await configManager.getConfig("apiKey")

    if (!apiKey.isSome()) {
        set(
            chatCompletionTaskAtom,
            O.Some<ChatCompletionTask>({ ...taskMeta, type: "error", error: new Error("API key is not set") }),
        )
        setAppLayout((draft) => {
            draft.isConfigModalOpen = true
        })
        return
    }

    const stream = await getChatCompletionStream(apiKey.get(), messages, chat.options, {}, abortController.signal)

    if (stream.isError()) {
        set(
            chatCompletionTaskAtom,
            O.Some<ChatCompletionTask>({ ...taskMeta, type: "error", error: stream.getError() }),
        )
        return
    }

    const resp = stream.get()

    const reader = resp.getReader()

    const observable = readerToObservable(reader)

    const textDecoder = new TextDecoder()

    observable
        .pipe(
            map((value) => textDecoder.decode(value)),
            map(parseEventSource),
            mergeMap((events) => from(events)),
        )
        .subscribe({
            next(event) {
                const content = event.match({
                    Ok: (event) => {
                        if (event === "[DONE]") {
                            return ""
                        }

                        return event.choices[0]?.delta?.content ?? ""
                    },
                    Error: (error) => {
                        consola.error(error)
                        return ""
                    },
                })

                set(messageMapAtom, (draft) => {
                    const chat = draft[taskMeta.generatingMessageID]
                    invariant(chat, "chat should exist")
                    chat.content += content
                })
            },
            error(error) {
                set(
                    chatCompletionTaskAtom,
                    O.Some<ChatCompletionTask>({ ...taskMeta, type: "error", error: new Error(stringify(error)) }),
                )
            },
            complete() {
                set(chatCompletionTaskAtom, O.Some<ChatCompletionTask>({ ...taskMeta, type: "done", content: "" }))
            },
        })
})
