import { runEffects } from '@typed/effects'
import { Maybe } from '@typed/maybe'
import { describe, it } from '@typed/test'
import { createHookEnvironment } from './createHookEnvironment'
import { createHooksManager } from './createHooksManager'
import { useRef } from './useRef'
import { withHooks } from './withHooks'

export const test = describe(`useRef`, [
  it(`allows keeping state across function invocations`, ({ equal }, done) => {
    const manager = createHooksManager()
    const hooksEnv = createHookEnvironment(manager)
    const initialValue: number = 1
    const endingValue: number = 100
    const test = withHooks(function*(value: number) {
      const [ref] = yield* useRef<number>(value)

      try {
        equal(Maybe.of(initialValue), ref.current)

        if (value === endingValue) {
          done()
        }
      } catch (error) {
        done(error)
      }
    })

    for (let i = initialValue; i <= endingValue; ++i) {
      runEffects(test(i), hooksEnv)
    }
  }),
])