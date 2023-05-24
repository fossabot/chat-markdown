import { useResizeObserver } from "@react-hookz/web"
import { lazy, Suspense, useRef } from "react"

import type { UUIDStamp } from "@/lib/uuid"
import { useMessage } from "@/stores/atoms"
import type { ChatItem } from "@/stores/types"

import * as css from "./styles.css"

const ChatMessage = lazy(() => import("@/components/atoms/ChatMessage"))

export type ChatProps = {
    data: ChatItem
    isGenerating: boolean
}

const StatefulChatMessage = ({ id }: { id: UUIDStamp }) => {
    const [data] = useMessage(id)
    const message = data ? <ChatMessage data={data} /> : null

    return <Suspense>{message}</Suspense>
}

const Chat = ({ data, isGenerating }: ChatProps) => {
    const { messages } = data

    const contentRef = useRef<HTMLDivElement>(null)

    useResizeObserver(
        contentRef,
        () => {
            window.scrollTo(0, document.body.scrollHeight)
        },
        isGenerating,
    )

    return (
        <div className={css.container}>
            <div className={css.content} ref={contentRef}>
                {messages.map((id) => (
                    <StatefulChatMessage key={id} id={id} />
                ))}
            </div>
        </div>
    )
}

export default Chat
