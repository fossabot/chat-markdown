import { style } from "@vanilla-extract/css"

export const container = style({
    width: "fit-content",
    maxWidth: "75%",
    display: "flex",
    justifyContent: "center",
})

export const input = style({
    textAlign: "center",
    textTransform: "capitalize",
    width: "100%",
    height: "100%",
    outline: "none",
    boxShadow: "none",
    borderColor: "transparent",

    ":focus": {
        outline: "none",
        boxShadow: "none",
        borderColor: "transparent",
        // border: "1px solid #6b7280",
    },
})
