import { createGlobalTheme, createVar } from "@vanilla-extract/css"

export const desktopBreakpoint = createVar()
export const lineHeightRelaxed = createVar()

export const vars = createGlobalTheme(":root", {
    desktopBreakpoint: "768px",
    contentWidth: "1024px",
    floatingContentWidth: "calc(100% - 2rem)",
    contentPaddingX: "1rem",
    colors: {
        white: "#fff",
        black: "#000",
        primary: "#2563eb",
        secondary: "#2b6cb0",
        background: "#f1f2f2",
        hover: "rgba(0, 0, 0, 0.05)",
        overlay: "rgba(0, 0, 0, 0.15)",
        selected: "#2563eb",
        text: "#1a202c",
        warn: "rgba(255, 255, 100, 1)",
        error: "rgba(255, 100, 100, 1)",
        success: "rgba(100, 255, 100, 1)",
        transparent: "transparent",
    },
    spacing: {
        spacingPx: "1px",
        spacing0: "0",
        spacing1: "0.25rem",
        spacing2: "0.5rem",
        spacing3: "0.75rem",
        spacing4: "1rem",
        spacing5: "1.25rem",
        spacing6: "1.5rem",
        spacing8: "2.0rem",
        spacing12: "3.0rem",
    },
    font: {
        family: {
            fontFamilyBody: `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
        'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
        'Segoe UI Symbol', 'Noto Color Emoji'`,
            // fontFamilyHeading: 'Source Serif Pro'
        },
        size: {
            fontSizeRoot: "16px",
            fontSize0: "0.8rem",
            fontSize1: "1rem",
            fontSize2: "1.25rem",
            fontSize3: "1.563rem",
            fontSize4: "1.953rem",
            fontSize5: "2.441rem",
            fontSize6: "3.052rem",
            fontSize7: "3.815rem",
        },
        weight: {
            fontWeightBold: "700",
            fontWeightBlack: "900",
        },
    },
})
