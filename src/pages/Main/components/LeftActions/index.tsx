import { FloatingPortal, offset, shift, useClick, useDismiss, useFloating, useInteractions } from "@floating-ui/react"
import { ActionIcon, Group } from "@mantine/core"
import { CaretDownIcon, PlusIcon } from "@radix-ui/react-icons"
import { useState } from "react"

import { ChatList } from "../ChatList"
import * as css from "./styles.css"

type LeftActionsProps = {
    onAddChatClick?: () => void
}

export const LeftActions = ({ onAddChatClick }: LeftActionsProps) => {
    const [isOpen, setIsOpen] = useState(false)

    const { context, floatingStyles, refs } = useFloating({
        placement: "bottom",
        open: isOpen,
        onOpenChange: setIsOpen,
        middleware: [offset(24), shift()],
    })

    const click = useClick(context)

    const { getFloatingProps, getReferenceProps } = useInteractions([click])

    useDismiss(context, {
        outsidePress: true,
    })

    return (
        <Group>
            <ActionIcon variant="default" aria-label="settings" onClick={onAddChatClick}>
                <PlusIcon color="#666" />
            </ActionIcon>
            <ActionIcon
                variant="default"
                aria-label="dropdown"
                ref={refs.setReference}
                {...getReferenceProps()}
                disabled={isOpen}
            >
                <CaretDownIcon color="#666" />
            </ActionIcon>
            {isOpen ? (
                <FloatingPortal>
                    <div className={css.dropdown} ref={refs.setFloating} style={floatingStyles} {...getFloatingProps()}>
                        <ChatList
                            onRequestClose={() => {
                                setIsOpen(false)
                            }}
                        />
                    </div>
                </FloatingPortal>
            ) : null}
        </Group>
    )
}
