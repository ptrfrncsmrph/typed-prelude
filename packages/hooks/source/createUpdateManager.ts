import { Pure } from '@typed/env'

export function createUpdateManager<A extends object>() {
  // WeakSet is used to allow GC to automatically clean things up for us
  const updated = new WeakSet<A>()

  function* setUpdated(node: A, hasBeenUpdated: boolean) {
    yield Pure.fromIO(() => {
      hasBeenUpdated ? updated.add(node) : updated.delete(node)
    })
  }

  function hasBeenUpdated(node: A) {
    return updated.has(node)
  }

  return {
    setUpdated,
    hasBeenUpdated,
  } as const
}
