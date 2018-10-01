import { first, second, Tuple } from '../tuple/tuple'

type Step = Tuple<RegExp, string>
const STEPS: Step[] = [
  [/\\/g, '\\\\'],
  [/[\b]/g, '\\b'],
  [/\f/g, '\\f'],
  [/\n/g, '\\n'],
  [/\r/g, '\\r'],
  [/\t/g, '\\t'],
  [/\v/g, '\\v'],
  [/\0/g, '\\0'],
]

const LAST_STEP: Step = [/"/g, '\\"']

export function quote(s: string): string {
  const escaped = STEPS.reduce(applyStep, s)

  return '"' + applyStep(escaped, LAST_STEP) + '"'
}

function applyStep(str: string, step: Step): string {
  return str.replace(first(step), second(step))
}
