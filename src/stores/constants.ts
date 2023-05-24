import { UUIDStamp } from "@/lib/uuid"

import type { ChatCompletionOptions } from "../api/types"
import { type Locales } from "../i18n/i18n-types"
import type { ChatItem } from "./types"

export const DEFAULT_LOCALE: Locales = "en"

export const DEFAULT_APP_LAYOUT = {
    isSidebarOpen: false,
    isConfigModalOpen: false,
}

export const DEFAULT_CHAT_COMPLETION_OPTIONS: ChatCompletionOptions = {
    model: "gpt-3.5-turbo",
    temperature: 0.5,
    max_tokens: 4096,
    top_p: 1,
    presence_penalty: 0,
    frequency_penalty: 0,
}

// eslint-disable-next-line max-len
export const DEFAULT_SYSTEM_MESSAGE = `I am a researcher with expertise in multiple fields, capable of assisting users in solving problems.

Additional rule:

Answer should be written in markdown format.`

export const EMPTY_CHAT_ITEM: ChatItem = {
    id: UUIDStamp(),
    title: "",
    messages: [],
    options: DEFAULT_CHAT_COMPLETION_OPTIONS,
}
