import { Effect } from '@typed/effects'
import { any } from '@typed/logic'
import { Mixed, Type } from './Type'

export const shouldUseIdentity = (types: readonly Mixed[]): boolean =>
  any((s) => s.encode !== Effect.of, types)

export type Props = Readonly<Record<PropertyKey, Mixed>>

export type PropsOf<A> = { readonly [K in keyof A]: Type<A[K]> }
