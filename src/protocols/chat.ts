import type { Pretty } from "@/lib/utilityTypes"

import type { ContentProtocol, CreatableProtocol, IDProtocol, RoleProtocol, TitleProtocol } from "./base"

export type MessageProtocol = Pretty<IDProtocol & RoleProtocol & ContentProtocol & CreatableProtocol>

export type ChatProtocol = Pretty<IDProtocol & TitleProtocol & CreatableProtocol> & {
    messages: MessageProtocol[]
}
