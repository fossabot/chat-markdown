import { globalStyle, style } from "@vanilla-extract/css"

import { vars } from "@/theme/vars.css"

export const container = style({
    margin: "1rem",
    padding: "0.5rem",
    borderRadius: "0.5rem",
    background: vars.colors.background,
})

globalStyle(`${container} .cm-editor`, {
    backgroundColor: "transparent",

    "@media": {
        "screen and (max-width: 768px)": {
            fontSize: "14px",
        },
    },
})

globalStyle(`${container} .cm-editor.cm-focused`, {
    outline: "none",
})

globalStyle(`${container} .cm-editor .cm-scroller`, {
    fontFamily: `${vars.font.family.fontFamilyBody}`,
})
