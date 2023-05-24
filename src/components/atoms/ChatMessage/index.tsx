import "highlight.js/scss/nord.scss"

import { forwardRef } from "react"
import { ErrorBoundary } from "react-error-boundary"
import ReactMarkdown from "react-markdown"
import type { PluggableList } from "react-markdown/lib/react-markdown"
import rehypeHighlight from "rehype-highlight"
import rehypeKatex from "rehype-katex"
import remarkBreaks from "remark-breaks"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"

import type { MessageItem } from "@/stores/types"

import * as css from "./styles.css"

export type ChatMessageProps = {
    data: MessageItem
}

const remarkExtensions = [remarkGfm, remarkBreaks, remarkMath]

const rehypeExtensions: PluggableList = [[rehypeHighlight, { ignoreMissing: true }], rehypeKatex]

const ChatMessage = forwardRef<HTMLDivElement, ChatMessageProps>(({ data, ...rest }, ref) => {
    const { content, role } = data

    return (
        <div className={css.container[role]} ref={ref} {...rest}>
            <article className={`${css.content[role]} prose`}>
                <ErrorBoundary fallback={<div>{content}</div>}>
                    <ReactMarkdown remarkPlugins={remarkExtensions} rehypePlugins={rehypeExtensions}>
                        {content}
                    </ReactMarkdown>
                </ErrorBoundary>
            </article>
        </div>
    )
})

export default ChatMessage
