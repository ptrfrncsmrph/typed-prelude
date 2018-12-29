import { CodeNode, SourceListMap } from 'source-list-map'
import { EmitResults } from '../types'
import { wrapModuleInFactory } from '../wrapModuleInFactory/wrapModuleInFactory'

const OPEN = new CodeNode(`var modules = {\n`)
const CLOSE = new CodeNode(`\n}`)
const COMMA = new CodeNode(`,`)

export type CreateModulesObjectOptions = {
  results: EmitResults
  dynamicImportPaths?: string[]
}

export function createModulesObject({
  results,
  dynamicImportPaths = [],
}: CreateModulesObjectOptions): SourceListMap {
  const sourceList = new SourceListMap([OPEN])
  const entries = Array.from(results.entries())
  const last = entries.length - 1

  for (let i = 0; i < entries.length; ++i) {
    const [fileName, result] = entries[i]

    if (dynamicImportPaths.includes(fileName)) {
      continue
    }

    sourceList.add(new CodeNode(`${result.moduleId}: `))
    sourceList.add(wrapModuleInFactory(result))

    if (i !== last) {
      sourceList.add(COMMA)
    }
  }

  sourceList.add(CLOSE)

  return sourceList
}
