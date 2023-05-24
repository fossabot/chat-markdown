import { Modal } from "@mantine/core"
import { useAtom } from "jotai"
import { lazy, Suspense, useMemo } from "react"
import { match } from "ts-pattern"

import { Router } from "@/router"
import { apiKeyAtom, appLayoutAtom } from "@/stores/atoms"

import * as css from "./App.css"

const Main = lazy(() => import("./Main"))
// const About = lazy(() => import("./About/About"))

export const App = () => {
    const route = Router.useRoute(["Main", "About", "Preferences"])

    const [apiKey, setApiKey] = useAtom(apiKeyAtom)

    const [appLayout, setAppLayout] = useAtom(appLayoutAtom)

    return (
        <main className={css.appShellScreen}>
            <Suspense>
                {useMemo(
                    () =>
                        match(route)
                            .with({ name: "Main" }, () => <Main />)
                            // .with({ name: "About" }, () => <About />)
                            .otherwise(() => null),
                    [route],
                )}
            </Suspense>
            <Modal
                centered
                title="Preferences"
                overlayProps={{
                    opacity: 0.55,
                    blur: 4,
                }}
                opened={appLayout.isConfigModalOpen}
                onClose={() => {
                    setAppLayout((draft) => {
                        draft.isConfigModalOpen = false
                    })
                }}
            >
                <label className="block">
                    <span className="text-gray-700">OpenAI API Key</span>
                    <input
                        type="password"
                        className="mt-1 block w-full"
                        placeholder=""
                        autoComplete="off"
                        autoCorrect="off"
                        required
                        value={apiKey}
                        onChange={(event) => {
                            const { value } = event.target
                            setApiKey(value)
                        }}
                    />
                </label>
            </Modal>
        </main>
    )
}
