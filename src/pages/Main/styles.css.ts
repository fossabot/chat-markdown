import { style } from "@vanilla-extract/css"

export const container = style({
    display: "flex",
    flexFlow: "column nowrap",
    justifyContent: "space-between",
    position: "relative",
    paddingTop: "3rem",
    paddingBottom: "104px",
    width: "100%",
    minHeight: "100%",
})

export const content = style({
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "stretch",
    alignItems: "stretch",
})

const fixed = style({
    position: "fixed",
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: "#fff",
})

export const topFixed = style([
    fixed,
    {
        top: 0,
    },
])

export const bottomFixed = style([
    fixed,
    {
        bottom: 0,
    },
])
