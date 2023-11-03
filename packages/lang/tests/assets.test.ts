import zp, { Env } from '../src/lib'
import stocks from '../src/data/stocks'
import cypto from '../src/data/crypto'

import * as r from 'ramda'
import e from 'express'

describe('assets', () => {
  test('load module', () => {
    const ast = zp.getAst(String.raw`
      (import "core/indicators")

      (def symbol "AMD")
      (sma 21 symbol)
    `)

    const env = new Env({ bars: stocks })

    const res = ast.map(stmt => stmt.eval(env))
    expect(res[0]).toEqual('core/indicators')
  })

  test('define an asset', () => {
    const ast = zp.getAst(String.raw`
      {MSFT}
      {MSFT, today}
      {MSFT, yesterday}
      {MSFT, 3 days ago}

      (def asset "AMD")
      {asset, yesterday}
    `)

    const env = new Env()

    // env.loadModule(modules.indicators)

    env.loadBars(stocks)

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

    // yesterday
    expect(res[2]).toMatchObject({
      symbol: 'MSFT',
      open: 335.33,
      high: 335.37,
      low: 332.17,
      close: 333.68,
      volume: 20396223,
      date: 1686024000000,
      dateFormatted: '2023-06-06T04:00:00.000Z'
    })

    // 3 days ago
    expect(res[3]).toMatchObject({
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
    const env = new Env()
    env.loadBars(stocks)

    const ast = zp.getAst(String.raw`
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
    const env = new Env()

    env.loadBars(stocks)

    env.bind('sma', (prices) => {
      return r.mean(prices)
    })

    const ast = zp.getAst(String.raw`
      (:close {MSFT, 2 bars})
      (sma (:close {AAPL, 10 bars}))
    `)

    const res = ast.map(stmt => stmt.eval(env))

    expect(res[0]).toEqual([323.46, 333.68])
    expect(res[1].toFixed(3)).toEqual('177.247')
  })

  test('assets with variable', () => {
    const env = new Env()
    env.loadBars(stocks)

    const ast = zp.getAst(String.raw`
      (def x 5)
      {MSFT, x bars}
      {MSFT, x days ago}
    `)

    const res = ast.map(stmt => stmt.eval(env))

    expect(res[1].length).toEqual(5)
    expect(res[2]).toEqual({
      symbol: 'MSFT',
      open: 332.29,
      high: 335.94,
      low: 327.33,
      close: 328.39,
      volume: 45959770,
      date: 1685505600000,
      dateFormatted: '2023-05-31T04:00:00.000Z'
    })
  })

  test('assets list and window', () => {
    const metaEnv = new Env({ isMeta: true })

    const ast = zp.getAst(String.raw`
      {AAPL, 2 days ago}
      {AMD, 10 days ago}
      (:close {MSFT, 10 bars})
      (if
        (> (:close {AAPL, 8 days ago}) 100)
          (:volume {AMD, 21 days ago})
          (:open {MSFT, 33 bars})
      )
      (def x {AAPL, 12 days ago})
      (def myObj {aapl: {AAPL, 22 days ago}, msft: {MSFT, 10 days ago}})
    `)

    ast.map(stmt => stmt.eval(metaEnv))
    const assets = metaEnv.getAssets()

    expect(assets.AAPL).toEqual(22)
    expect(assets.MSFT).toEqual(33)
    expect(assets.AMD).toEqual(10)
  })

  test('loop assets', () => {
    const env = new Env()
    env.loadBars(stocks)

    const ast = zp.getAst(String.raw`
      (def assets ["AAPL", "MSFT"])

      (loop a in (map (fn [x] {x}) assets)
        (:close a)
      )
    `)

    const res = ast.map(stmt => stmt.eval(env))
    expect(res[1]).toEqual([[177.83], [323.46]])
  })

  test('crypto assets', () => {
    const env = new Env({ bars: cypto })
    const code = String.raw`
      #pragma version "^0.1.0"
      #pragma market "crypto"

      {ETH/USD, 2 days ago}
      {ETH/USD, 3 bars}

      (def symbol "ETH/USD")

      {symbol, yesterday}
    `

    const res = zp.evalCode(env, code)
    expect(res[2].close).toEqual(1922.24)
    // console.dir(res)
  })
})
