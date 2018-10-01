import { Fn, Uncurry } from './types'

export function uncurry<F extends Fn>(f: F): Uncurry<F> {
  if (typeof f !== 'function' || f.length === 0) {
    return f as Uncurry<F>
  }

  // tslint:disable-next-line:only-arrow-functions
  return (function() {
    let r = f
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < arguments.length; i++) {
      r = r(arguments[i])
    }

    return uncurry(r)
  } as any) as Uncurry<F>
}
