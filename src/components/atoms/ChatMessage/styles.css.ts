import { globalStyle, style, styleVariants } from "@vanilla-extract/css"

import { vars } from "@/theme/vars.css"

export const baseContainer = style({
    margin: "1rem 0",
    display: "flex",
    width: "100%",
})

export const baseContent = style({
    padding: "0.5rem 1rem",
    borderRadius: "1rem",
    maxWidth: "100%",
    lineHeight: "1.5",
    overflow: "hidden",
    background: "#f1f2f2",
})

export const container = styleVariants({
    system: [baseContainer, { justifyContent: "center" }],
    user: [baseContainer, { justifyContent: "flex-end" }],
    assistant: [baseContainer, { justifyContent: "flex-start" }],
})

export const content = styleVariants({
    system: [baseContent, { background: "#2e3440", color: "#f1f2f2" }],
    user: [baseContent, { background: "#2563eb", color: "#f1f2f2" }],
    assistant: [baseContent, { background: "#f1f2f2", color: "#1a202c" }],
})

globalStyle(`${baseContent} pre`, {
    backgroundColor: "#2e3440",
    whiteSpace: "pre-wrap",
    wordWrap: "break-word",
    fontFamily: "iosevka, monospace",
})

globalStyle(`${baseContent} ol`, {
    listStyle: "decimal",
})

globalStyle(`${baseContent} ul`, {
    listStyle: "disc",
})
