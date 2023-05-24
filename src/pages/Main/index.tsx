import { ActionIcon } from "@mantine/core"
import { GearIcon } from "@radix-ui/react-icons"
import consola from "consola"
import { produce } from "immer"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { lazy } from "react"
import useEvent from "react-use-event-hook"

import { Header } from "@/components/atoms/Header"
import { TitleInput } from "@/components/atoms/TitleInput"
import { UUIDStamp } from "@/lib/uuid"
import {
    activeChatIDAtom,
    addChatAtom,
    addMessageAtom,
    chatCompletionTaskAtom,
    requestChatCompletionAtom,
    setAppLayout,
    updateChatAtom,
    useChat,
} from "@/stores/atoms"
import { EMPTY_CHAT_ITEM } from "@/stores/constants"
import type { MessageItem } from "@/stores/types"

import { LeftActions } from "./components/LeftActions"
import * as css from "./styles.css"

const Chat = lazy(() => import("@/pages/Main/components/Chat"))

const MarkdownEditor = lazy(() => import("@/components/atoms/MarkdownEditor"))

export default function Main() {
    const [activeChatID, setActiveChatID] = useAtom(activeChatIDAtom)
    const [chat] = useChat(activeChatID)
    const addMessage = useSetAtom(addMessageAtom)
    const addChat = useSetAtom(addChatAtom)
    const updateChat = useSetAtom(updateChatAtom)
    // const removeChat = useSetAtom(removeChatAtom)
    // const toggleChat = useSetAtom(toggleChatAtom)
    const requestChatCompletion = useSetAtom(requestChatCompletionAtom)

    const chatCompletionTask = useAtomValue(chatCompletionTaskAtom)

    const isGenerating = chatCompletionTask.isSome() && chatCompletionTask.get().type === "pending"

    const onAddChatClick = useEvent(() => {
        if (isGenerating) {
            return
        }

        if (chat.messages.length === 1 && chat.title === "") {
            document.querySelector<HTMLElement>("#chat-title")?.focus()
            return
        }

        const newChat = produce(EMPTY_CHAT_ITEM, (draft) => {
            draft.id = UUIDStamp()
        })

        addChat(newChat)
        setActiveChatID(newChat.id)
    })

    const onMessageCreate = useEvent(async (content: string) => {
        const message: MessageItem = {
            id: UUIDStamp(),
            content,
            role: "user",
        }
        addMessage(message)
        updateChat(activeChatID, (draft) => {
            draft.messages.push(message.id)
        })

        const result = await requestChatCompletion(activeChatID)

        consola.debug(result)
    })

    const shouldSend = useEvent((value: string) => value.trim() !== "" && !isGenerating)

    const rightActions = (
        <ActionIcon
            variant="default"
            aria-label="settings"
            onClick={() => {
                setAppLayout((draft) => {
                    draft.isConfigModalOpen = !draft.isConfigModalOpen
                })
            }}
        >
            <GearIcon color="#666" spacing={0} />
        </ActionIcon>
    )

    return (
        <main className={css.container}>
            <div className={css.topFixed}>
                <Header left={<LeftActions onAddChatClick={onAddChatClick} />} right={rightActions}>
                    <TitleInput
                        id="chat-title"
                        value={chat.title}
                        placeholder="Untitled"
                        onChange={(event) => {
                            updateChat(activeChatID, (draft) => {
                                draft.title = event.currentTarget.value
                            })
                        }}
                    />
                </Header>
            </div>
            <div className={css.content}>
                <Chat data={chat} isGenerating={isGenerating} />
            </div>
            <div className={css.bottomFixed}>
                <MarkdownEditor onComplete={onMessageCreate} shouldComplete={shouldSend} />
            </div>
        </main>
    )
}
