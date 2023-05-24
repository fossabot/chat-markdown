import { style } from "@vanilla-extract/css"

export const container = style({
    width: "100%",
    height: "3rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderBottom: "1px solid rgb(240, 240, 240)",

    "@media": {
        "(prefers-color-scheme: dark)": {
            color: "rgb(240, 240, 240)",
        },
    },
})

export const center = style({
    width: "calc(100% - 208px)",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
})

const aside = style({
    position: "absolute",
    top: 0,
    bottom: 0,
    display: "flex",
    alignItems: "center",
    minWidth: "3rem",
})

export const left = style([
    aside,
    {
        left: "1rem",
        justifyContent: "flex-start",
    },
])

export const right = style([
    aside,
    {
        right: "1rem",
        justifyContent: "flex-end",
    },
])
