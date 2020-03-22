import { Effect, get } from '@typed/effects'
import { RandomIntEnv } from '../../model'

export function* generateRandomInt(from: number, to: number): Effect<RandomIntEnv, number> {
  const { floor, random } = yield* get<RandomIntEnv>()

  return floor(random() * floor(to)) + floor(from)
}