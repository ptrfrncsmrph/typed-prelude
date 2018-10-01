import { Arity1, curry } from '../../lambda'
import { chain } from '../chain'
import { map } from '../map'

export const ap: {
  <A, B>(fn: Array<Arity1<A, B>>, value: A[]): B[]
  <A, B>(fn: Array<Arity1<A, B>>): (value: A[]) => B[]
} = curry(<A, B>(fn: Array<Arity1<A, B>>, value: A[]): B[] => chain(f => map(f, value), fn))
