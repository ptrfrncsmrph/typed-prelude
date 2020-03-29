import { Computation, fail, TypeOf } from '@typed/effects'
import { HookEnv } from '@typed/hooks'
import { fromJust, isNothing } from '@typed/maybe'
import { decryptWithRsaKeyPair } from '../asymmetrical'
import { CryptoFailure, EncryptionEnv } from '../common'
import { useAuthChannel } from './AuthChannel'

export interface DecryptUserData
  extends Computation<[ArrayBuffer], EncryptionEnv & HookEnv, ArrayBuffer> {}

export function* decryptUserData(data: ArrayBuffer): TypeOf<DecryptUserData> {
  const { encryptedKeyPair } = yield* useAuthChannel()

  if (isNothing(encryptedKeyPair)) {
    return yield* fail(CryptoFailure, new Error(`Unable to retrieve encrypted key pair`))
  }

  return yield* decryptWithRsaKeyPair(fromJust(encryptedKeyPair), data)
}
