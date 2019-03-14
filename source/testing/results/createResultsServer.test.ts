import { describe, given, it, Test, TYPED_TEST } from '@typed/test'
import { uuid } from '@typed/uuid'
import { getMachineId } from '../getMachineId'
import { TestResult } from '../types'
import { createResultsPublisher } from './createResultsPublisher'
import { createResultsServer } from './createResultsServer'

const timeout = (ms: number, test: Test): Test => {
  const config = test[TYPED_TEST]

  return { ...test, [TYPED_TEST]: { ...config, timeout: ms } }
}

export const test = timeout(
  20000,
  describe(`createResultsServer`, [
    given(`a namespace and a callback`, [
      it(`receives results`, async ({ equal }) => {
        const namespace = getMachineId()
        const testRunId = 100
        const testResults: TestResult[] = [{ testId: uuid(), type: 'pass' }]
        const server = createResultsServer({
          namespace,
        })
        const publisher = createResultsPublisher({
          namespace,
        })
        const dispose = () => {
          server.dispose()
          publisher.dispose()
        }

        await new Promise(resolve => publisher.onAdded(resolve))

        publisher.publish({ testRunId, results: testResults, testMetadataId: uuid() })

        const actual = await server.once(testRunId)

        equal(testResults, actual.results)
        equal(testRunId, actual.testRunId)
        dispose()
      }),
    ]),
  ]),
)