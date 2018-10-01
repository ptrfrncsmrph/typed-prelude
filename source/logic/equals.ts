import { equals as _equals } from '../common/equals'
import { curry } from '../lambda'

export const equals = curry(<A>(a: A, b: A) => _equals(a, b, [], [])) as Equals

export type Equals = {
  <A, B = A>(a: A, b: B): B extends A ? boolean : false
  <A>(a: A): <B = A>(b: B) => B extends A ? boolean : false
}
