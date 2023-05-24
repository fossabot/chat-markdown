import type { Role } from "@/api/types"

export type IDProtocol = {
    id: string
}

export type RoleProtocol = {
    role: Role
}

export type TitleProtocol = {
    title: string
}

export type ContentProtocol = {
    content: string
}

export type CreatableProtocol = {
    createdAt: string
    createdBy: Role
    updatedAt: string
    updatedBy: Role
}

export type ListItemProtocol = IDProtocol & TitleProtocol

export type ListProtocol<T extends IDProtocol = ListItemProtocol> = { items: T[] }
