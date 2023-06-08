import { Env } from '../src/core'
import parser from '../src/parser'
import analyzer from '../src/analyzer'
import data from '../src/data'
import * as r from 'ramda'

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
      {MSFT, 3 days ago}
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

    // 3 days ago
    expect(res[1]).toMatchObject({
      symbol: 'MSFT',
      open: 334.247,
      high: 337.5,
      low: 332.55,
      close: 335.4,
      volume: 25177109,
      date: 1685678400000,
      dateFormatted: '2023-06-02T04:00:00.000Z'
    })
  })

  test('access asset close, open, volume', () => {
    const env = new Env(data)

    const ast = createAst(String.raw`
      (:close {MSFT})
      (:close {MSFT, 3 days ago})
      (def vol (:volume {MSFT, 2 days ago}))
      vol
    `)

    const res = ast.map(stmt => stmt.eval(env))

    expect(res[0]).toBe(323.46)
    expect(res[1]).toEqual(335.4)
    expect(res[3]).toBe(21314758)
  })

  test('get price for multiple days', () => {
    const env = new Env(data)
    env.bind('sma', (prices) => {
      return r.mean(prices)
    })

    const ast = createAst(String.raw`
      (:close {MSFT, 2 bars})
      (sma (:close {AAPL, 10 bars}))
    `)

    const res = ast.map(stmt => stmt.eval(env))
    console.log(res)

    expect(res[0]).toEqual([323.46, 333.68])
    expect(res[1].toFixed(3)).toEqual('177.247')
  })
})
