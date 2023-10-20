import { Lambda, type Env } from '../language'
import { utils as zpUtils, type Order, type Position, type OrderOptions } from '@zapant/core'
import { pick } from 'ramda'

const name = 'trading'
const namespace = 'core'

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

  zpEnv.bind(ns + 'portfolio', portfolio)
  zpEnv.bind(ns + 'changePortfolio', (obj) => {
    portfolio = { ...portfolio, ...obj }
    console.log('changePortfolio', portfolio)
  })

  zpEnv.bind(ns + 'getOpenPositions', (lamda) => {
    if (lamda) {
      return portfolio.openPositions.filter(pos => {
        return lamda instanceof Lambda ? lamda.eval(zpEnv, [pos]) : lamda(pos)
      })
    }

    return portfolio.openPositions
  })

  zpEnv.bind(ns + 'balance', () => {
    const bars = zpEnv.get('$$bars')
    portfolio.orders = zpUtils.trading.balance(portfolio.orders, portfolio.openPositions, { bars })

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

  // zpEnv.bind(ns + 'execute', (orders?: Order[]) => {
  //   return portfolio.execute(orders ?? portfolio.data.orders)
  // })

  zpEnv.bind(ns + 'closePositions', (positions) => {
    const bars = zpEnv.get('$$bars')
    const positionsToClose = positions ?? portfolio.openPositions

    if (positionsToClose.length === 0) { return [] }

    const orders = zpUtils.trading.closePositions(positionsToClose, { bars })
    portfolio.orders = [...portfolio.orders, ...orders]

    return orders
  })

  zpEnv.bind(ns + 'order', (action, asset, qty, options: OrderOptions = {}) => {
    if (isMeta) {
      return []
    }

    if (qty < 0) throw new Error(`${action} {${asset.symbol}}: Quantity cannot be negative`)

    const bars = zpEnv.get('$$bars')
    const [order] = zpUtils.trading.createOrdersUnits([asset.symbol], { [asset.symbol]: 1 }, qty, { action, bars })

    if (options.target) {
      const [newOrder] = zpUtils.trading.balance([order], portfolio.openPositions.filter(p => p.symbol === order.symbol), { bars })

      portfolio.orders.push(newOrder)
      return newOrder
    } else {
      portfolio.orders.push(order)
      return order
    }
  })

  zpEnv.bind(ns + 'buy', (asset, qty, options = {}) => zpEnv.get(ns + 'order')('buy', asset, qty, options))
  zpEnv.bind(ns + 'buyAmount', (asset, amount, options: any = {}) => {
    const qty = options.round ? Math.floor(amount / asset.close) : amount / asset.close
    return zpEnv.get(ns + 'buy')(asset, qty, options)
  })

  zpEnv.bind(ns + 'sell', (asset, qty, options = {}) => zpEnv.get(ns + 'order')('sell', asset, qty, options))
  zpEnv.bind(ns + 'sellAmount', (asset, amount, options: any = {}) => {
    const qty = options.round ? Math.floor(amount / asset.close) : amount / asset.close
    return zpEnv.get(ns + 'sell')(asset, qty, options)
  })
}

export default {
  name,
  namespace,
  load
}
