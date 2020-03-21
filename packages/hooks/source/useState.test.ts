import { Disposable } from '@typed/disposable'
import { runEffects } from '@typed/effects'
import { describe, given, it } from '@typed/test'
import { NodeGenerator } from '@typed/uuid'
import { increment } from '../../math/source'
import { createHookEnvironment } from './createHookEnvironment'
import { createHooksManager } from './createHooksManager'
import { InitialState } from './HookEnvironment'
import { useState } from './useState'
import { withHooks } from './withHooks'

export const test = describe(`useState`, [
  given(`an initial state`, [
    it(`returns a current state and updater fn`, ({ equal }, done) => {
      const manager = createHooksManager(new NodeGenerator())
      const hookEnvironment = createHookEnvironment(manager)
      const expectedValues = [1, 2, 3]
      const sut = withHooks(function*() {
        const [getX, updateX] = yield* useState(InitialState.of(1))
        const expected = expectedValues.shift()
        const actual = yield* getX()

        try {
          equal(expected, actual)
          yield* updateX(increment)

          if (expectedValues.length === 0) {
            done()
          }
        } catch (error) {
          done(error)
        }
      })

      runEffects(sut(), { hookEnvironment })
      runEffects(sut(), { hookEnvironment })
      runEffects(sut(), { hookEnvironment })
    }),
  ]),
])
