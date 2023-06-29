import zp, { Env } from '../src/lib'
import data from '../src/data'
// import * as r from 'ramda'

describe('trading', () => {
  test('load trading module', () => {
    const ast = zp.getAst(String.raw`
      (import "core/trading" :as td)
      (td/portfolio)
    `)

    const env = new Env()
    env.loadBars(data)

    const res = ast.map(stmt => stmt.eval(env))
    console.log(res)
    expect(res[0]).toEqual('core/trading :as td')
  })
})
