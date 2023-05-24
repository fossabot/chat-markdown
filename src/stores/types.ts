import type { ChatCompletionOptions, ChatMessage } from "@/api/types"
import type { Pretty } from "@/lib/utilityTypes"
import type { UUIDStamp } from "@/lib/uuid"

export type ChatItem = {
    id: UUIDStamp
    title: string
    messages: UUIDStamp[]
    options: ChatCompletionOptions
}

export type MessageItem = Pretty<
    ChatMessage & {
        id: UUIDStamp
    }
>

export type AppLayout = {
    isSidebarOpen: boolean
    isConfigModalOpen: boolean
}
