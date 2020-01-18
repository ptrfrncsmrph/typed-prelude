import { Arity2 } from '@typed/lambda'
import { useMemo } from './useMemo'
import { useState } from './useState'

export function* useReducer<A, B>(reducer: Arity2<A, B, A>, seed: A) {
  const [state, updateState] = yield* useState(seed)
  const dispatch = yield* useMemo(
    () => (event: B) => updateState(state => reducer(state, event)),
    [],
  )

  return [state, dispatch] as const
}
