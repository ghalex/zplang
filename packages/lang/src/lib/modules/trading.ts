import { Lambda, type Env } from '../language'
import { createJsEnv } from '@zapcli/core'

const name = 'trading'
const namespace = 'core'

const load = (zpEnv: Env, as: string = '') => {
  const isMeta = zpEnv.get('$$isMeta')
  const bars = zpEnv.get('$$bars')

  const js = createJsEnv(bars)
  const ns = as.length > 0 ? as + '/' : ''

  zpEnv.bind(ns + 'getCash', js.getCash)
  zpEnv.bind(ns + 'getTotalCapital', js.getTotalCapital)
  zpEnv.bind(ns + 'getOrders', js.getOrders)
  zpEnv.bind(ns + 'getPositions', js.getPositions)
  zpEnv.bind(ns + 'getPosition', js.getPosition)
  zpEnv.bind(ns + 'setCash', js.setCash)
  zpEnv.bind(ns + 'setOrders', js.setOrders)
  zpEnv.bind(ns + 'setPositions', js.setPositions)
  zpEnv.bind(ns + 'getOrder', js.getOrder)
  zpEnv.bind(ns + 'balance', js.balance)
  zpEnv.bind(ns + 'hasPosition', js.hasPosition)
  zpEnv.bind(ns + 'closePositions', js.closePositions)
  zpEnv.bind(ns + 'order', isMeta ? () => [] : js.order)
  zpEnv.bind(ns + 'buy', isMeta ? () => [] : js.buy)
  zpEnv.bind(ns + 'buyAmount', isMeta ? () => [] : js.buyAmount)
  zpEnv.bind(ns + 'sell', isMeta ? () => [] : js.sell)
  zpEnv.bind(ns + 'sellAmount', isMeta ? () => [] : js.sellAmount)
}

export default {
  name,
  namespace,
  load
}
