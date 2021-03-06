import { Effects } from '@typed/effects'
import { Either, fromRight, isLeft, Right } from '@typed/either'
import { HttpEnv, HttpRequest, toJson } from '@typed/http'
import { curry } from '@typed/lambda'
import { DecodeFailure } from './decoder'
import { Type } from './types/Type'

export const validateHttpRequest: ValidateHttpRequest = curry(checkHttpRequest)

type ValidateHttpRequest = {
  <A, B = A>(type: Type<A, B>, request: HttpRequest<A>): Effects<
    HttpEnv & DecodeFailure,
    Either<Error, B>
  >
  <A, B = A>(type: Type<A, B>): (
    request: HttpRequest<A>,
  ) => Effects<HttpEnv & DecodeFailure, Either<Error, B>>
}

function* checkHttpRequest<A, B = A>(
  type: Type<A, B>,
  request: HttpRequest<A>,
): Effects<HttpEnv & DecodeFailure, Either<Error, B>> {
  const response = toJson(yield* request)

  if (isLeft(response)) {
    return response
  }

  return Right.of(type.encode(yield* type.decode(fromRight(response))))
}
