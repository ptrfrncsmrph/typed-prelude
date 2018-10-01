import { clone } from '../common/clone'
import { curry } from '../lambda'

export const set: {
  <K extends PropertyKey, V, O extends { [Key in K]: V }>(key: K, value: V, obj: O): O
  <K extends PropertyKey, V>(key: K, value: V): <O extends { [Key in K]: V }>(obj: O) => O
  <K extends PropertyKey>(key: K): {
    <V, O extends { [Key in K]: V }>(value: V, obj: O): O
    <V>(value: V): <O extends { [Key in K]: V }>(obj: O) => O
  }
} = curry(__set)

function __set<K extends PropertyKey, V, O extends { [Key in K]: V }>(key: K, value: V, obj: O): O {
  const o = clone(obj, [], [], true)
  o[key] = value

  return o
}
