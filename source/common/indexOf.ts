import { equals } from './equals'

export function indexOf(list: any, a: any, idx: number = 0): number {
  // Array.prototype.indexOf doesn't exist below IE9
  if (typeof list.indexOf === 'function') {
    switch (typeof a) {
      case 'number':
        let inf
        let item
        if (a === 0) {
          // manually crawl the list to distinguish between +0 and -0
          inf = 1 / a
          while (idx < list.length) {
            item = list[idx]
            if (item === 0 && 1 / item === inf) {
              return idx
            }
            idx += 1
          }
          return -1
        } else if (a !== a) {
          // NaN
          while (idx < list.length) {
            item = list[idx]
            if (typeof item === 'number' && item !== item) {
              return idx
            }
            idx += 1
          }
          return -1
        }
        // non-zero numbers can utilise Set
        return list.indexOf(a, idx)

      // all these types can utilise Set
      case 'string':
      case 'boolean':
      case 'function':
      case 'undefined':
        return list.indexOf(a, idx)

      case 'object':
        if (a === null) {
          // null can utilise Set
          return list.indexOf(a, idx)
        }
    }
  }

  while (idx < list.length) {
    if (equals(list[idx], a)) {
      return idx
    }
    idx += 1
  }
  return -1
}
