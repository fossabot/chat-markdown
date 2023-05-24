export type Pretty<T> =
    // eslint-disable-next-line @typescript-eslint/ban-types, functional/readonly-type
    {} & {
        [P in keyof T]: T[P]
    }

export type UnionFromTuple<T> = T extends (infer U)[] ? U : never
