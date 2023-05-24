import { forwardRef, Fragment, memo, useRef } from "react"

import type { ListItemProtocol } from "@/protocols/base"

import * as css from "./styles.css"

type ListProps = {
    data?: ListItemProtocol[]
    selectedID?: string
    renderItem?: (item: ListItemProtocol, selected: boolean, index: number) => React.ReactNode
    // onSelectPrev?: () => void
    // onSelectNext?: () => void
}

const defaultData: ListItemProtocol[] = []

export const ListItem = ({ children, onClick, ...rest }: { children: React.ReactNode; onClick?: () => void }) => {
    return (
        <div className={css.item} onClick={onClick} {...rest}>
            <span className={css.itemText}>{children}</span>
        </div>
    )
}

const List = forwardRef<HTMLDivElement, ListProps>(
    ({ data = defaultData, renderItem, selectedID, ...rest }: ListProps, ref) => {
        const scrollContainer = useRef<HTMLDivElement>(null)

        return (
            <div ref={ref} className={css.container} {...rest}>
                <div className={css.content} ref={scrollContainer}>
                    <div className={css.itemList}>
                        {data.map((item, index) => {
                            return (
                                <Fragment key={item.id}>{renderItem?.(item, item.id === selectedID, index)}</Fragment>
                            )
                        })}
                    </div>
                </div>
            </div>
        )
    },
)

export default memo(List)
