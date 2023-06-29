import { Lambda, type Env } from '../../language'
import Portfolio from './portfolio'
import type { Order, OrderOptions } from './types'
// import { closePositions, balance } from './utils'

const name = 'trading'
const namespace = 'core'

const load = (zpEnv: Env, as: string = '') => {
  const isMeta = zpEnv.get('$$isMeta')
  const ns = as.length > 0 ? as + '/' : ''
  const portfolio = new Portfolio(0, [])

  zpEnv.bind(ns + 'portfolio', (newData) => {
    if (newData) {
      portfolio.data = newData
      return portfolio.data
    }

    return portfolio.data
  })

  zpEnv.bind(ns + 'openPositions', () => {
    return portfolio.openPositions
  })

  zpEnv.bind(ns + 'openPositionsWith', (lamda) => {
    return portfolio.openPositions.filter(pos => {
      return lamda instanceof Lambda ? lamda.eval(zpEnv, [pos]) : lamda(pos)
    })
  })

  zpEnv.bind(ns + 'balance', () => {
    const bars = zpEnv.get('$$bars')
    return portfolio.balance(bars)
  })

  zpEnv.bind(ns + 'execute', (orders: Order[]) => {
    return portfolio.execute(orders)
  })

  zpEnv.bind(ns + 'closePositions', (positions) => {
    const bars = zpEnv.get('$$bars')
    const positionsToClose = positions ?? portfolio.openPositions

    if (positionsToClose.length === 0) { return [] }

    return portfolio.closePositions(positionsToClose, bars)
  })

  zpEnv.bind(ns + 'order', (action, asset, qty, options: OrderOptions = {}) => {
    if (isMeta) {
      return []
    }

    if (qty < 0) throw new Error(`${action} {${asset.symbol}}: Quantity cannot be negative`)

    const bars = zpEnv.get('$$bars')
    return portfolio.order(asset, action, qty, options, bars)
  })

  zpEnv.bind(ns + 'buy', (asset, qty, options = {}) => zpEnv.get(ns + 'order')('buy', asset, qty, options))
  zpEnv.bind(ns + 'buyAmount', (asset, amount, options: any = {}) => {
    const qty = options.round ? Math.round(amount / asset.close) : amount / asset.close
    return zpEnv.get(ns + 'buy')(asset, qty, options)
  })

  zpEnv.bind(ns + 'sell', (asset, qty, options = {}) => zpEnv.get(ns + 'order')('sell', asset, qty, options))
  zpEnv.bind(ns + 'sellAmount', (asset, amount, options: any = {}) => {
    const qty = options.round ? Math.round(amount / asset.close) : amount / asset.close
    return zpEnv.get(ns + 'sell')(asset, qty, options)
  })
}

export default {
  name,
  namespace,
  load
}
