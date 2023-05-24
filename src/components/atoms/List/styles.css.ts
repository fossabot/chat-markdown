import { globalStyle, style } from "@vanilla-extract/css"

import { vars } from "@/theme/vars.css"

export const container = style({
    width: "100%",
    height: "100%",
    position: "relative",
    borderRadius: "0.5rem",
    color: "rgba(0, 0, 0, 0.8)",
    fontSize: "14px",
})

export const content = style({
    padding: "0 0.5rem",
    width: "100%",
    height: "100%",
    overflowY: "auto",
})

export const itemList = style({
    width: "100%",
})

export const item = style({
    margin: "0.5rem 0",
    padding: "0 0.5rem",
    display: "flex",
    alignItems: "center",
    width: "100%",
    height: "38px",
    borderRadius: "0.25rem",
    background: "#fff",
    cursor: "pointer",
})

globalStyle(`${itemList} [data-selected='true']`, {
    color: "#fff",
    background: vars.colors.primary,
})

export const itemText = style({
    color: "inherit",
    fontWeight: "400",
    fontSize: "14px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
})
