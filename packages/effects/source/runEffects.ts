import { Disposable } from '@typed/disposable'
import { execPure, handle } from '@typed/env'
import { Effect, EffectResources } from './Effect'
import { runEffect } from './runEffect'

export function runEffects<A extends Effect<any, any, any>>(
  effect: A,
  resources: EffectResources<typeof effect>,
): Disposable {
  return execPure(handle(resources, runEffect(effect)))
}
