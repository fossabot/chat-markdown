import { BiMap } from "@rizzzse/bimap"
import { Array as A, Option as O } from "@swan-io/boxed"
import { formatDistanceToNow } from "date-fns"
import { useAtom, useAtomValue } from "jotai"
import { startTransition, useMemo } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import useEvent from "react-use-event-hook"

import List, { ListItem } from "@/components/atoms/List"
import { isUUIDStamp, uid } from "@/lib/uuid"
import type { TitleProtocol } from "@/protocols/base"
import { activeChatIDAtom, chatSummariesAtom } from "@/stores/atoms"

import * as css from "./styles.css"

type ChatListProps = {
    onRequestClose: () => void
}

const SectionTitle = ({ title }: TitleProtocol) => {
    return <span className={css.sectionTitle}>{title}</span>
}

export const ChatList = ({ onRequestClose }: ChatListProps) => {
    const [activeChatID, setActiveChatID] = useAtom(activeChatIDAtom)

    const chatSummaries = useAtomValue(chatSummariesAtom)

    const sorted = useMemo(
        () => [...chatSummaries].sort((a, b) => uid.parseStamp(b.id).getTime() - uid.parseStamp(a.id).getTime()),
        [chatSummaries],
    )

    const markers = useMemo(() => {
        const markers: BiMap<string, number> = new BiMap()

        for (const [index, chat] of sorted.entries()) {
            const date = uid.parseStamp(chat.id)

            const dateAgo = formatDistanceToNow(date, { addSuffix: true })

            if (markers.has(dateAgo)) {
                continue
            }

            markers.inverse.set(index, dateAgo)
        }

        return markers
    }, [sorted])

    const onSelectedChange = useEvent(({ id }) => {
        if (!isUUIDStamp(id)) {
            return
        }
        startTransition(() => {
            setActiveChatID(id)
        })
    })

    const onSelectPrev = useEvent(() => {
        A.findIndex(sorted, (chat) => chat.id === activeChatID)
            .flatMap((index) => O.fromNullable(sorted[index - 1]))
            .map(onSelectedChange)
    })

    const onSelectNext = useEvent(() => {
        A.findIndex(sorted, (chat) => chat.id === activeChatID)
            .flatMap((index) => O.fromNullable(sorted[index + 1]))
            .map(onSelectedChange)
    })

    useHotkeys("up", onSelectPrev)
    useHotkeys("down", onSelectNext)
    useHotkeys("esc", onRequestClose)
    useHotkeys("enter", onRequestClose)

    return (
        <List
            data={sorted}
            selectedID={activeChatID}
            renderItem={(item, selected, index) => (
                <>
                    {markers.inverse.has(index) ? <SectionTitle title={markers.inverse.get(index) ?? ""} /> : null}
                    <ListItem
                        data-selected={selected}
                        onClick={() => {
                            onSelectedChange({ id: item.id })
                        }}
                    >
                        {item.title || "Untitled"}
                    </ListItem>
                </>
            )}
        />
    )
}
