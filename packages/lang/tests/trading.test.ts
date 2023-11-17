import zp, { Env } from '../src/lib'
import data from '../src/data/stocks'
// import * as r from 'ramda'

const positions = [{
  symbol: 'AAPL',
  openDate: 1682366400000,
  openPrice: 200.00,
  closeDate: null,
  closePrice: null,
  units: 5.5,
  side: 'long',
  accountType: 'paper'
}, {
  symbol: 'MSFT',
  openDate: 1682366400000,
  openPrice: 300.00,
  closeDate: null,
  closePrice: null,
  units: 5.1,
  side: 'long',
  accountType: 'paper'
}]

describe('trading', () => {
  test('load trading module', () => {
    const env = new Env({ bars: data })
    env.loadModuleByName('core/trading')

    const code = String.raw`
      (def symbols [
        "AAPL",
        "MSFT",
        "AMD"
      ])

      (buy {AAPL} 1 {target: true})
      (getPortfolio)
    `

    const changePortfolio = env.get('changePortfolio')
    changePortfolio({
      initialCapital: 2000,
      openPositions: [...positions]
    })

    // Eval code
    const res = zp.evalCode(env, code)

    // Get values from result
    const order = res[1]
    const portfolio = res[2]

    expect(order.units).toEqual(4.5)
    expect(order.action).toEqual('sell')
    expect(portfolio.orders.length).toEqual(1)
    expect(portfolio.openPositions.length).toEqual(2)
    expect(portfolio.initialCapital).toEqual(2000)
  })

  test('balance', () => {
    const env = new Env({ bars: data })
    env.loadModuleByName('core/trading')

    // Change portfolio
    const changePortfolio = env.get('changePortfolio')
    changePortfolio({
      initialCapital: 2000,
      openPositions: [...positions]
    })

    // Eval code
    const res = zp.evalCode(env, String.raw`
      (def symbols [
        "AAPL",
        "MSFT",
        "AMD"
      ])

      (loop symbol in symbols
        (buy {symbol} 5)
      )

      (balance)
    `)

    // Get values from result
    const orders = res[1].map(r => r[0])
    const ordersBalanced = res[2]

    expect(orders.length).toEqual(3)
    expect(orders[1].units).toEqual(5)

    expect(ordersBalanced.length).toEqual(3)
  })

  test('balance with minAmount', () => {
    const env = new Env({ bars: data })
    env.loadModuleByName('core/trading')

    // Change portfolio
    const changePortfolio = env.get('changePortfolio')
    changePortfolio({
      initialCapital: 2000,
      openPositions: [...positions]
    })

    // Eval code
    const res = zp.evalCode(env, String.raw`
      (def symbols [
        "AAPL",
        "MSFT",
        "AMD"
      ])

      (loop symbol in symbols
        (buy {symbol} 5)
      )

      ;; This will skip MSFT but not AAPL
      (balance {minAmount: 40})
    `)

    // Get values from result
    const orders = res[1].map(r => r[0])
    const ordersBalanced = res[2]

    expect(orders.length).toEqual(3)
    expect(orders[1].units).toEqual(5)

    expect(ordersBalanced[0].symbol).toEqual('AAPL')
    expect(ordersBalanced[0].units).toEqual(0.5)
    expect(ordersBalanced.length).toEqual(2)

  })
})
