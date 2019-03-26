import { Disposable } from '@most/types'
import { LogLevel } from '@typed/common/logger'
import { Uuid } from '@typed/uuid'
import { Publisher } from 'cote'
import { TestConfig } from '../types'
import { TestConfigEvent, testConfigEventNames } from './common'

export type CreateTestConfigPublisherOptions = {
  namespace: string
  logLevel: LogLevel
}

export type TestConfigPublisher = Disposable & {
  readonly publish: (testRunId: Uuid, configs: TestConfig[]) => void
}

export function createTestConfigPublisher({
  namespace,
  logLevel,
}: CreateTestConfigPublisherOptions): TestConfigPublisher {
  const publisher = new Publisher(
    { namespace, name: 'TestConfig Publisher', broadcasts: testConfigEventNames },
    { log: LogLevel.DEBUG === logLevel },
  )
  const publish = (testRunId: Uuid, testConfigs: TestConfig[]) =>
    publisher.publish<TestConfigEvent>(testConfigEventNames[0], {
      type: 'testConfig',
      testRunId,
      testConfigs,
    })
  const dispose = () => {
    publisher.removeAllListeners()
    publisher.close()
  }

  return { publish, dispose }
}
