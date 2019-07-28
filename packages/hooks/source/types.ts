import { Disposable } from '@typed/disposable'
import { Arity1, IO } from '@typed/lambda'
import { Timer } from '@typed/timer'

export interface Context<A = any> {
  readonly defaultValue: A
}

export interface HooksContext extends Disposable {
  readonly state: {
    hasBeenUpdated: boolean
    shouldRerunHooks: boolean
    fn: (...args: any) => any
    fnContext: any
    fnArguments: any
    returnValue: any
    currentId: number
  }

  readonly nextId: () => number
  readonly resetId: () => void
  readonly timer: Timer
  readonly hooks: Map<number, Hook>
  readonly contexts: WeakMap<Context, any>
  readonly update: () => void
}

export interface CreateHookContext {
  readonly timer: Timer
  readonly hasBeenUpdated: () => void
  readonly provide: <A>(context: Context<A>, value: A) => void
}

export type CreateHook<A extends readonly any[] = any[], B = any> = (
  context: CreateHookContext,
  ...args: A
) => Hook<A, B>

export interface Hook<A extends readonly any[] = any, B = any> extends Disposable {
  readonly update: (...args: A) => B
}

export type InitialValue<A> = IO<A> | A
export type ValueOrUpdate<A> = Arity1<A, A> | A
