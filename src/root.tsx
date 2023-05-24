import "@/styles/base.css"
import "@/styles/global.scss"
import "@/styles/overrides.scss"

import { MantineProvider } from "@mantine/core"

import TypesafeI18n from "./i18n/i18n-react"
import type { Locales } from "./i18n/i18n-types"
import { App } from "./pages/App"
import { mantineTheme } from "./theme/mantine.config"

export const Root = ({ locale }: { locale: Locales }) => {
    return (
        <TypesafeI18n locale={locale}>
            <MantineProvider theme={{ ...mantineTheme, colorScheme: "light" }}>
                <App />
            </MantineProvider>
        </TypesafeI18n>
    )
}
