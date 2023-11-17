import { Lambda, type Env } from '../language'
import type { Order, Position, Bar } from '@zapant/core'
import * as zpCore from '@zapant/core'
import { pick } from 'ramda'

const name = 'trading'
const namespace = 'core'

interface OrderOptions {
  round?: boolean
  target?: boolean
}

const load = (zpEnv: Env, as: string = '') => {
  const isMeta = zpEnv.get('$$isMeta')
  const ns = as.length > 0 ? as + '/' : ''
  let portfolio = {
    orders: [] as Order[],
    openPositions: [] as Position[],
    initialCapital: 0,
    totalCapital: 0,
    availableCapital: 0
  }

  zpEnv.bind(ns + 'getPortfolio', () => portfolio)
  zpEnv.bind(ns + 'changePortfolio', (obj) => {
    portfolio = { ...portfolio, ...pick(['openPositions', 'initialCapital', 'totalCapital', 'availableCapital'], obj) }
  })

  zpEnv.bind(ns + 'getOpenPositions', (lamda) => {
    if (lamda) {
      return portfolio.openPositions.filter(pos => {
        return lamda instanceof Lambda ? lamda.eval(zpEnv, [pos]) : lamda(pos)
      })
    }

    return portfolio.openPositions
  })

  zpEnv.bind(ns + 'getPosition', (symbol) => {
    const p = portfolio.openPositions.find(p => p.symbol === symbol)
    return p ?? null
  })

  zpEnv.bind(ns + 'balance', ({ minAmount }: any = {}) => {
    const bars = zpEnv.get('$$bars')
    portfolio.orders = zpCore.balance(portfolio.orders, portfolio.openPositions, { bars, minAmount })

    return portfolio.orders
  })

  zpEnv.bind(ns + 'checkPosition', (symbol, side) => {
    const p = portfolio.openPositions.find(p => p.symbol === symbol)

    if (p) {
      if (side && p.side !== side) return false
      return true
    }

    return false
  })

  zpEnv.bind(ns + 'closePositions', (positions) => {
    const bars = zpEnv.get('$$bars')
    const positionsToClose = positions ?? portfolio.openPositions

    if (positionsToClose.length === 0) { return [] }

    const orders = zpCore.position.closePositions(positionsToClose, { bars })
    portfolio.orders = [...portfolio.orders, ...orders]

    return orders
  })

  zpEnv.bind(ns + 'order', (action: 'buy' | 'sell', asset: Bar, qty: number, options: OrderOptions = {}) => {
    if (isMeta) {
      return []
    }

    if (qty < 0) throw new Error(`${action} {${asset.symbol}}: Quantity cannot be negative`)

    const bars = zpEnv.get('$$bars')
    const [order] = zpCore.order.createOrdersUnits([asset.symbol], { [asset.symbol]: 1 }, qty, { action, bars })

    if (options.target) {
      const [newOrder] = zpCore.balance([order], portfolio.openPositions.filter(p => p.symbol === order.symbol), { bars })

      portfolio.orders.push(newOrder)
      return newOrder
    } else {
      portfolio.orders.push(order)
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
