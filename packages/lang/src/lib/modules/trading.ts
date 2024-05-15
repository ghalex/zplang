import { Lambda, type Env } from '../language'
import type { Order, Position, Bar } from '@zapant/core'
import * as zpCore from '@zapant/core'

const name = 'trading'
const namespace = 'core'

interface OrderOptions {
  round?: boolean
  target?: boolean
}

const load = (zpEnv: Env, as: string = '') => {
  const isMeta = zpEnv.get('$$isMeta')
  const ns = as.length > 0 ? as + '/' : ''
  const data = {
    cash: 0,
    orders: [] as Order[],
    positions: [] as Position[]
  }

  zpEnv.bind(ns + 'getCash', () => data.cash)
  zpEnv.bind(ns + 'getOrders', () => data.orders.concat())
  zpEnv.bind(ns + 'getPositions', () => data.positions.concat())
  zpEnv.bind(ns + 'getPosition', (symbol) => {
    const p = data.positions.find(p => p.symbol === symbol)
    return p ?? null
  })

  zpEnv.bind(ns + 'setCash', (value) => data.cash = value)
  zpEnv.bind(ns + 'setOrders', (orders) => data.orders = [...orders])
  zpEnv.bind(ns + 'setPositions', (positions) => {
    data.positions = [...positions]
})

  zpEnv.bind(ns + 'getOrder', (symbol) => {
    const o = data.orders.find(p => p.symbol === symbol)
    return o ?? null
  })

  zpEnv.bind(ns + 'balance', ({ minAmount }: any = { minAmount: 0 }) => {
    const bars = zpEnv.get('$$bars')
    data.orders = zpCore.balance(data.orders, data.positions, { bars, minAmount })

    return data.orders
  })

  zpEnv.bind(ns + 'checkPosition', (symbol, side) => {
    const p = data.positions.find(p => p.symbol === symbol)

    if (p) {
      if (side && p.side !== side) return false
      return true
    }

    return false
  })

  zpEnv.bind(ns + 'closePositions', (value) => {
    const bars = zpEnv.get('$$bars')
    const positionsToClose = value ?? data.positions

    if (positionsToClose.length === 0) { return [] }

    const newOrders = zpCore.position.closePositions(positionsToClose, { bars })
    data.orders = [...data.orders, ...newOrders]

    return data.orders
  })

  zpEnv.bind(ns + 'order', (action: 'buy' | 'sell', asset: Bar, qty: number, options: OrderOptions = {}) => {
    if (isMeta) {
      return []
    }

    if (qty < 0) throw new Error(`${action} {${asset.symbol}}: Quantity cannot be negative`)

    const bars = zpEnv.get('$$bars')
    const [order] = zpCore.order.createOrdersUnits([asset.symbol], { [asset.symbol]: 1 }, qty, { action, bars })

    if (options.target) {
      const [newOrder] = zpCore.balance([order], data.positions.filter(p => p.symbol === order.symbol), { bars })

      data.orders.push(newOrder)
      return newOrder
    } else {
      data.orders.push(order)
      return order
    }
  })

  zpEnv.bind(ns + 'buy', (asset, qty, options = {}) => {
    const order = zpEnv.get(ns + 'order')
    return order('buy', asset, qty, options)
  })

  zpEnv.bind(ns + 'buyAmount', (asset, amount, options: any = {}) => {
    const qty = options.round ? Math.floor(amount / asset.close) : amount / asset.close
    const buy = zpEnv.get(ns + 'buy')
    return buy(asset, qty, options)
  })

  zpEnv.bind(ns + 'sell', (asset, qty, options = {}) => {
    const order = zpEnv.get(ns + 'order')
    return order('sell', asset, qty, options)
  })

  zpEnv.bind(ns + 'sellAmount', (asset, amount, options: any = {}) => {
    const qty = options.round ? Math.floor(amount / asset.close) : amount / asset.close
    const sell = zpEnv.get(ns + 'sell')
    return sell(asset, qty, options)
  })
}

export default {
  name,
  namespace,
  load
}
