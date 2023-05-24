import { z } from "zod"

const env = z.object({
    VITE_OPENAI_API_ENDPOINT: z.string().default("https://api.openai.com/v1/chat/completions"),
    VITE_OPENAI_API_KEY: z.string(),
})

export const { VITE_OPENAI_API_ENDPOINT, VITE_OPENAI_API_KEY } = env.parse(import.meta.env)

declare global {
    // rome-ignore lint/suspicious/noEmptyInterface: <explanation>
    interface ImportMetaEnv extends z.infer<typeof env> {}
}
