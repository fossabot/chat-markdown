import { z } from "zod"

import { ConfigManager } from "./lib/config"

export const Config = z.object({
    apiKey: z.string().describe("OpenAI api key"),
    // model: z.string().describe("OpenAI model"),
    // temperature: z.number().min(0).max(1).describe("OpenAI temperature"),
    // max_tokens: z.number().min(1).max(4097).describe("OpenAI max tokens"),
    // top_p: z.number().min(0).max(1).describe("OpenAI top p"),
    // best_of: z.number().min(1).max(16).describe("OpenAI best of"),
    // n: z.number().min(1).max(16).describe("OpenAI n"),
    // frequency_penalty: z.number().min(0).max(1).describe("OpenAI presence penalty"),
    // presence_penalty: z.number().min(0).max(1).describe("OpenAI frequency penalty"),
})

export type Config = z.infer<typeof Config>

export const defaultConfig: Config = {
    apiKey: "",
    // model: "gpt-3.5-turbo",
    // temperature: 0.5,
    // max_tokens: 4096,
    // top_p: 1,
    // best_of: 1,
    // n: 1,
    // frequency_penalty: 0,
    // presence_penalty: 0,
}

export const configManager = ConfigManager.make({ name: ".config.dat", parse: (data) => Config.parse(data) })
