import { markdown, markdownLanguage } from "@codemirror/lang-markdown"
import { languages } from "@codemirror/language-data"
import { EditorView } from "@codemirror/view"
import { Option as O } from "@swan-io/boxed"
import type { BasicSetupOptions } from "@uiw/react-codemirror"
import CodeMirror from "@uiw/react-codemirror"
import { basicLight } from "cm6-theme-basic-light"
import { memo, useRef } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { useHotkeys } from "react-hotkeys-hook"
import useEvent from "react-use-event-hook"

import * as css from "./styles.css"

type MarkdownEditorProps = {
    defaultValue?: string
    placeholder?: string
    onChange?: (value: string) => void
    onComplete?: (value: string) => void
    shouldComplete?: (value: string) => boolean
    shouldResetEditor?: (value: string) => boolean
}

const defaultShouldComplete = (value: string) => value.trim() !== ""

const defaultShouldResetEditor = (value: string) => value.trim() !== ""

const setupOptions: BasicSetupOptions = {
    lineNumbers: false,
    highlightActiveLineGutter: false,
    foldGutter: false,
    // dropCursor?: boolean;
    allowMultipleSelections: true,
    // indentOnInput?: boolean;
    bracketMatching: true,
    closeBrackets: false,
    autocompletion: false,
    rectangularSelection: true,
    crosshairCursor: true,
    highlightActiveLine: false,
    highlightSelectionMatches: false,
    closeBracketsKeymap: false,
    searchKeymap: false,
    foldKeymap: false,
    completionKeymap: false,
    lintKeymap: false,
    tabSize: 2,
}

const defaultPlaceholder = "Shift+Enter to send, Enter to add new line"

const extensions = [markdown({ base: markdownLanguage, codeLanguages: languages }), EditorView.lineWrapping]

const MarkdownEditor = memo(
    ({
        defaultValue = "",
        onChange,
        onComplete,
        placeholder = defaultPlaceholder,
        shouldComplete = defaultShouldComplete,
        shouldResetEditor = defaultShouldResetEditor,
    }: MarkdownEditorProps) => {
        const contentRef = useRef(defaultValue)
        const editorRef = useRef<O<EditorView>>(O.None())

        const focusEditor = useEvent(() => {
            const editor = editorRef.current
            editor.map((editor) => {
                editor.focus()
            })
        })

        const resetEditor = useEvent(() => {
            const editor = editorRef.current
            editor.map((editor) => {
                editor.dispatch({
                    changes: {
                        from: 0,
                        to: editor.state.doc.length,
                        insert: "",
                    },
                })
            })
        })

        useHotkeys(
            "shift+enter",
            (event) => {
                const content = contentRef.current.trim()
                if (!shouldComplete(content)) {
                    return
                }
                event.preventDefault()
                onComplete?.(content)
                if (shouldResetEditor(content)) {
                    resetEditor()
                }
            },
            {
                enableOnContentEditable: true,
            },
        )

        return (
            <div className={css.container} onClick={focusEditor}>
                <ErrorBoundary fallback={<div>Something went wrong</div>}>
                    <CodeMirror
                        aria-label="markdown-editor"
                        width="100%"
                        minHeight="64px"
                        maxHeight="320px"
                        defaultValue={defaultValue}
                        placeholder={placeholder}
                        onCreateEditor={(editor) => {
                            editorRef.current = O.Some(editor)
                        }}
                        onChange={(value) => {
                            contentRef.current = value
                            onChange?.(value)
                        }}
                        theme={basicLight}
                        basicSetup={setupOptions}
                        extensions={extensions}
                    />
                </ErrorBoundary>
            </div>
        )
    },
)

export default MarkdownEditor
