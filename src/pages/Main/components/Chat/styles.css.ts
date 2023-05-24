import { style } from "@vanilla-extract/css"

export const container = style({
    flex: 1,
    display: "flex",
    flexFlow: "column nowrap",
    alignItems: "stretch",
    width: "100%",
})

export const content = style({
    padding: "0 1rem",
})
