import "@total-typescript/ts-reset"

import { Option as O } from "@swan-io/boxed"
import { consola } from "consola"
import { enableMapSet, setAutoFreeze, setUseStrictShallowCopy } from "immer"
import React from "react"
import { createRoot } from "react-dom/client"
import { navigatorDetector } from "typesafe-i18n/detectors"

import { detectLocale } from "./i18n/i18n-util"
import { loadLocaleAsync } from "./i18n/i18n-util.async"
import { Root } from "./root"
import { loadConfigToAtom, loadDBToAtom } from "./stores/atoms"

enableMapSet()
setAutoFreeze(true)
setUseStrictShallowCopy(true)

const main = async () => {
    const locale = detectLocale(navigatorDetector)

    await loadLocaleAsync(locale)

    await loadConfigToAtom()

    await loadDBToAtom()

    O.fromNullable(document.querySelector("#root"))
        .map(createRoot)
        .map((root) => {
            root.render(
                React.createElement(Root, {
                    locale,
                }),
            )
        })
        .toResult(new Error("Could not find element with selector: #root"))
        .tapError(consola.error)
}

void main()
