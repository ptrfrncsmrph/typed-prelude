import { curry, Predicate } from '../../lambda'
import { map, Maybe } from '../../maybe'
import { findIndex } from '../findIndex'

export const find = curry(
  <A>(predicate: Predicate<A>, list: ArrayLike<A>): Maybe<A> =>
    map(index => list[index], findIndex(predicate, list)),
) as {
  <A>(predicate: Predicate<A>, list: ArrayLike<A>): Maybe<A>
  <A>(predicate: Predicate<A>): (list: ArrayLike<A>) => Maybe<A>
}
