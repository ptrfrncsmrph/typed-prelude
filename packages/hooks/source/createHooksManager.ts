import { Disposable } from '@typed/disposable'
import { runEffects } from '@typed/effects/source'
import { createSubscription } from '@typed/subscription'
import { UuidEnv } from '@typed/uuid'
import { createChannelManager } from './createChannelManager'
import { createTreeManager } from './createTreeManager'
import { createUpdateManager } from './createUpdateManager'
import {
  HookEnvironment,
  HookEnvironmentEvent,
  HookEnvironmentEventType,
  HooksManager,
} from './types'

const emptySet = new WeakSet()
const emptyMap = new WeakMap()

// A HooksManager keeps track of the hierarchy of a number of HookEnvironments.
// This is how @typed/hooks allows for providing and consuming values via its Channel API.
// At present the implementation of a HooksManager can only maintain
export function createHooksManager(uuidEnv: UuidEnv): HooksManager {
  const disposable = Disposable.lazy()
  const hookEvents = createSubscription<HookEnvironmentEvent>()
  const {
    setParent,
    removeNode,
    getAllDescendants,
    getAllAncestors,
    getParent,
  } = createTreeManager<HookEnvironment>()
  const { setUpdated, hasBeenUpdated } = createUpdateManager<HookEnvironment>((a) =>
    getAllDescendants(new WeakSet<any>(), new WeakMap<any, any>(), a),
  )
  const { useChannelState } = createChannelManager(
    function* (hookEnvironment, updated) {
      hookEvents.publish([HookEnvironmentEventType.Updated, { hookEnvironment, updated }])
    },
    getAllDescendants,
    getParent,
  )

  function* onEvent(event: HookEnvironmentEvent) {
    switch (event[0]) {
      case HookEnvironmentEventType.Created: {
        const { created, parent } = event[1]

        return yield* setParent(created, parent)
      }
      case HookEnvironmentEventType.Removed: {
        const hookEnvironment = event[1]

        hookEnvironment.dispose()

        return yield* removeNode(hookEnvironment)
      }
      case HookEnvironmentEventType.Updated: {
        const { hookEnvironment, updated } = event[1]

        return yield* setUpdated(hookEnvironment, updated)
      }
    }
  }

  function hasUpdatedParents(env: HookEnvironment) {
    for (const parent of getAllAncestors(env)) {
      if (parent.updated) {
        return true
      }
    }

    return false
  }

  disposable.addDisposable(hookEvents.subscribe((event) => runEffects(onEvent(event))))

  return {
    // Listen to incoming events
    ...disposable,

    // To pass down to createHookEnvironment
    ...uuidEnv,

    // Listen to hook events
    hookEvents,

    // Control Channels
    useChannelState,

    // Check if a node has been marked as updated
    hasBeenUpdated,

    // Check if a node has parent nodes marked as updated
    hasUpdatedParents,

    // Get descendant nodes
    getAllDescendants: (node) => getAllDescendants(emptySet, emptyMap, node),
  }
}
