import { Env } from '../src/core'
import parser from '../src/parser'
import analyzer from '../src/analyzer'
// import * as fs from 'node:fs'

const code1 = String.raw`
  (def arr1 [1, 2, 3])
  (length arr1)
`

const createAst = (code: string) => {
  const m = parser.parse(code)
  const semantics = analyzer.createSemantics(parser.getGrammar(), m)

  const ast = semantics(m).ast() as any[]
  return ast
}

describe('array', () => {
  test('defines an array', () => {
    const env = new Env()
    const ast = createAst(code1)
    const res = ast.map(stmt => stmt.eval(env))

    expect(res[0]).toEqual([1, 2, 3])
    expect(res[1]).toBe(3)
  })
})
