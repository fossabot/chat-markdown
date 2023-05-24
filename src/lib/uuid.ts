import { type Nominal } from "nominal-types"
import ShortUniqueId from "short-unique-id"

export type UUID = Nominal<"UUID", string>

export type UUIDStamp = Nominal<"UUIDStamp", string>

export const uid = new ShortUniqueId({ length: 10 })

export const UUID = (): UUID => uid() as UUID

export const UUIDStamp = () => uid.stamp(16) as UUIDStamp

export const isUUIDStamp = (id: string): id is UUIDStamp => {
    try {
        return uid.parseStamp(id) instanceof Date
    } catch {
        return false
    }
}
