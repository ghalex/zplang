import { Env } from '../src/core'
import parser from '../src/parser'
import analyzer from '../src/analyzer'
import data from '../src/data'

const createAst = (code: string) => {
  const m = parser.parse(code)
  const semantics = analyzer.createSemantics(parser.getGrammar(), m)

  const ast = semantics(m).ast() as any[]
  return ast
}

describe('assets', () => {
  test('define an asset', () => {
    const ast = createAst(String.raw`
      {MSFT}
      {MSFT, 5}
    `)

    const env = new Env(data)
    const res = ast.map(stmt => stmt.eval(env))

    expect(res[0]).toMatchObject({
      symbol: 'MSFT',
      open: 331.65,
      high: 334.49,
      low: 322.5,
      close: 323.46,
      volume: 35215393,
      date: 1686110400000,
      dateFormatted: '2023-06-07T04:00:00.000Z'
    })

    expect(res[1].length).toBe(5)
  })

  test('access asset close, open, volume', () => {
    const env = new Env(data)

    const ast = createAst(String.raw`
      (:close {MSFT})
      (:close {MSFT, 3})
      (:volume {MSFT})
    `)

    const res = ast.map(stmt => stmt.eval(env))

    expect(res[0]).toBe(323.46)
    expect(res[1]).toEqual([323.46, 333.68, 335.94])
    expect(res[2]).toBe(35215393)
  })
})
