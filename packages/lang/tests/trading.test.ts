import zp, { Env } from '../src/lib'
import data from '../src/data'
import type { Portfolio } from '@zapant/core'
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
    const code = String.raw`
      (import "core/trading")

      (def symbols [
        "AAPL",
        "MSFT",
        "AMD"
      ])

      (loop symbol in symbols
        (print "Buying " symbol)
        (buy {symbol} 1)
      )

      (print (json (portfolio/orders)))

      (:stats (portfolio/data))
    `

    const env = new Env({ bars: data })
    const res = zp.evalCode(env, code)
    const portfolio = env.get('portfolio') as Portfolio

    expect(res[0]).toEqual('core/trading')
    expect(portfolio.orders.length).toEqual(3)

    console.log(env.stdout)
  })

  test('balance', () => {
    const env = new Env({ bars: data })
    env.loadModuleByName('core/trading')

    const portfolio = env.get('portfolio') as Portfolio

    portfolio.change({
      initialCapital: 1000,
      positions: [...positions]
    } as any)

    portfolio.update(data as any)

    const res = zp.evalCode(env, String.raw`
      (def symbols [
        "AAPL",
        "MSFT",
        "AMD"
      ])

      (loop symbol in symbols
        (buy {symbol} 1 {target: true})
      )

      (execute)
      (len (portfolio/orders))
      (len (portfolio/openPositions))
    `)

    // console.dir(portfolio.data, { depth: null })
    // console.log(res)

    expect(res[3]).toEqual(2)
    expect(res[4]).toEqual(3)
  })
})
