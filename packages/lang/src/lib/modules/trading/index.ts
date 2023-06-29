// import dayjs from 'dayjs'
import { Lambda, type Env } from '../../language'
import Portfolio from './portfolio'
// import { closePositions, balance } from './utils'

const name = 'trading'
const namespace = 'core'

const load = (zpEnv: Env, as: string = '') => {
  // const isMeta = zpEnv.get('$$isMeta')
  const ns = as.length > 0 ? as + '/' : ''
  const portfolio = new Portfolio(0, [])

  zpEnv.bind(ns + 'portfolio', () => {
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

  // zpEnv.bind('balance', () => {
  //   const openPositions = zpEnv.get('openPositions')
  //   const orders = zpEnv.get('$$orders')
  //   const bars = zpEnv.get('$$bars')

  //   const newOrders = balance(orders, openPositions(), { bars })

  //   zpEnv.bind('$$orders', newOrders)
  // })

  // zpEnv.bind('order', (action, asset, qty, options: OrderOptions = {}) => {
  //   if (isMeta) {
  //     return []
  //   }

  //   if (qty < 0) throw new Error(`${action} {${asset.symbol}}: Quantity cannot be negative`)
  //   const order = {
  //     symbol: asset.symbol,
  //     date: asset.date,
  //     dateFormatted: dayjs(asset.date).toISOString(),
  //     price: asset.close,
  //     units: qty,
  //     action
  //   }

  //   if (options.target) {
  //     const openPositions = zpEnv.get('openPositions')
  //     const bars = zpEnv.getBars()

  //     const [newOrder] = zpUtils.orders.balance([order], openPositions.filter(p => p.symbol === order.symbol), { bars })

  //     if (newOrder) {
  //       zpEnv.get('$$orders').push(newOrder)
  //     }

  //     return newOrder ?? {}
  //   } else {
  //     zpEnv.get('$$orders').push(order)
  //   }

  //   return order
  // })

  // zpEnv.bind('closePositions', (positions) => {
  //   const bars = zpEnv.get('$$bars')
  //   const positionsToClose = positions ?? zpEnv.get('openPositions')

  //   if (positionsToClose.length === 0) { return [] }

  //   const orders = zpUtils.orders.closePositions(positionsToClose, { bars })
  //   orders.forEach(order => zpEnv.get('$$orders').push(order))
  //   return orders
  // })

  // zpEnv.bind('buy', (asset, qty, options = {}) => zpEnv.get('order')('buy', asset, qty, options))
  // zpEnv.bind('buyAmount', (asset, amount, options: any = {}) => {
  //   const qty = options.round ? Math.round(amount / asset.close) : amount / asset.close
  //   return zpEnv.get('buy')(asset, qty, options)
  // })

  // zpEnv.bind('sell', (asset, qty, options = {}) => zpEnv.get('order')('sell', asset, qty, options))
  // zpEnv.bind('sellAmount', (asset, amount, options: any = {}) => {
  //   const qty = options.round ? Math.round(amount / asset.close) : amount / asset.close
  //   return zpEnv.get('sell')(asset, qty, options)
  // })
}

export default {
  name,
  namespace,
  load
}
