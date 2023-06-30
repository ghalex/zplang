import zp, { Env } from '../src/lib'
import data from '../src/data'
// import * as r from 'ramda'

const positions = [{
  symbol: 'AAPL',
  openDate: 1682366400000,
  openPrice: 200.00,
  closeDate: null,
  closePrice: null,
  units: 5,
  side: 'long',
  accountType: 'paper'
}, {
  symbol: 'MSFT',
  openDate: 1682366400000,
  openPrice: 300.00,
  closeDate: null,
  closePrice: null,
  units: 1,
  side: 'long',
  accountType: 'paper'
}]

describe('trading', () => {
  test('load trading module', () => {
    const ast = zp.getAst(String.raw`
      (import "core/trading" :as td)

      (def symbols [
        "AAPL",
        "MSFT",
        "AMD"
      ])

      (loop symbol in symbols
        (td/buy {symbol} 1)
      )

      (td/portfolio)
    `)

    const env = new Env()

    env.loadBars(data)

    const res = ast.map(stmt => stmt.eval(env))
    const portfolio = env.get('td/portfolio')()

    expect(res[0]).toEqual('core/trading :as td')
    expect(portfolio.orders.length).toEqual(3)
  })

  test('balance', () => {
    const env = new Env()

    env.loadBars(data)
    env.loadModuleByName('core/trading')

    const portfolio = env.get('portfolio')({
      initialCapital: 1000,
      positions: [...positions]
    })

    zp.evalCode(env, String.raw`
      (def symbols [
        "AAPL",
        "MSFT",
        "AMD"
      ])

      (loop symbol in symbols
        (buy {symbol} 2 {target: true})
      )
    `)

    // console.log(portfolio)
    // console.log(env.get('execute')(portfolio.orders))

    expect(portfolio.orders.length).toEqual(3)
  })
})
