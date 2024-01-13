import { type Env } from '../language'
import indicators from '@zapant/indicators'
import * as r from 'ramda'

const name = 'indicators'
const namespace = 'core'

const getBars = (env, symbol, window) => {
  const fn = env.get('bars')
  return fn(symbol, window)
}

const load = (zpEnv: Env, as: string = '') => {
  const isMeta = zpEnv.get('$$isMeta')
  const ns = as.length > 0 ? as + '/' : ''

  // Simple Moving Avg
  zpEnv.bind(ns + 'sma', (len, symbol, rest: any = {}) => {
    const { roll, prop, offset } = r.mergeRight({ roll: 0, offset: 0, prop: 'close' }, rest)

    if (Array.isArray(symbol)) {
      if (isMeta) return 0
      return indicators.sma(len, symbol, { roll, offset })
    }

    if (isMeta) {
      zpEnv.addAsset(symbol, len + roll + offset)
      return roll ? [0] : 0
    }

    const data = getBars(zpEnv, symbol, len + roll + offset).map(b => b[prop])
    return indicators.sma(len, data, { roll, offset })
  })

  // Exponential moving averange
  zpEnv.bind(ns + 'ema', (len, symbol, rest: any = {}) => {
    const { roll, prop, offset } = r.mergeRight({ roll: 0, offset: 0, prop: 'close' }, rest)

    if (Array.isArray(symbol)) {
      if (isMeta) return 0
      return indicators.ema(len / 2, symbol, { roll, offset })
    }

    if (isMeta) {
      zpEnv.addAsset(symbol, len * 2 + roll + offset)
      return roll ? [0] : 0
    }

    const data = getBars(zpEnv, symbol, len * 2 + roll + offset).map(b => b[prop])
    return indicators.ema(len, data, { roll, offset })
  })

  // Momentum Squeeze
  zpEnv.bind(ns + 'mms', (len, symbol, rest: any = {}) => {
    const { roll, offset } = r.mergeRight({ roll: 0, offset: 0 }, rest)

    if (Array.isArray(symbol)) {
      if (isMeta) return 0
      return indicators.mms(len / 2, symbol, { roll, offset})
    }

    if (isMeta) {
      zpEnv.addAsset(symbol, len * 2 + roll + offset)
      return roll ? [0] : 0
    }

    const data = getBars(zpEnv, symbol, len * 2 + roll + offset)
    return indicators.mms(len, data, { roll, offset })
  })

  zpEnv.bind(ns + 'mm', (len, symbol, rest: any = {}) => {
    const { roll, prop, offset } = r.mergeRight({ roll: 0, offset: 0, prop: 'close' }, rest)

    if (Array.isArray(symbol)) {
      if (isMeta) return 0
      return indicators.momentum(len, symbol, { roll, offset })
    }

    if (isMeta) {
      zpEnv.addAsset(symbol, len + roll + offset)
      return roll ? [0] : 0
    }

    const data = getBars(zpEnv, symbol, len + roll + offset).map(b => b[prop])
    return indicators.momentum(len, data, { roll, offset })
  })

  // Averange True Range
  zpEnv.bind(ns + 'atr', (len, symbol, rest: any = {}) => {
    const { roll, offset } = r.mergeRight({ roll: 0, offset: 0 }, rest)

    if (Array.isArray(symbol)) {
      if (isMeta) return 0
      return indicators.atr(len, symbol, { roll, offset })
    }

    if (isMeta) {
      zpEnv.addAsset(symbol, len + roll + offset)
      return roll ? [0] : 0
    }

    const data = getBars(zpEnv, symbol, len + roll + offset + 1)
    return indicators.atr(len, data, { roll, offset })
  })

  // Cummulative return
  zpEnv.bind(ns + 'cmr', (len, symbol, rest: any = {}) => {
    const { roll, offset, prop } = r.mergeRight({ roll: 0, offset: 0, prop: 'close' }, rest)

    if (Array.isArray(symbol)) {
      if (isMeta) return 0
      return indicators.cmr(len, symbol, { roll, offset })
    }

    if (isMeta) {
      zpEnv.addAsset(symbol, len + roll + offset)
      return roll ? [0] : 0
    }

    const data = getBars(zpEnv, symbol, len + roll + offset + 1).map(b => b[prop])
    const res = indicators.cmr(len, data, { roll, offset })

    return res ?? 0
  })

  // Standard deviation
  zpEnv.bind(ns + 'std', (len, symbol, rest: any = {}) => {
    const { roll, prop, offset } = r.mergeRight({ roll: 0, offset: 0, prop: 'close' }, rest)

    if (Array.isArray(symbol)) {
      if (isMeta) return 0
      return indicators.std(len, symbol, { roll, offset })
    }

    if (isMeta) {
      zpEnv.addAsset(symbol, len + roll + offset)
      return roll ? [0] : 0
    }

    const data = getBars(zpEnv, symbol, len + roll + offset).map(b => b[prop])
    return indicators.std(len, data, { roll, offset })
  })

  zpEnv.bind(ns + 'highest', (len, symbol, rest: any = {}) => {
    const { roll, prop, offset } = r.mergeRight({ roll: 0, offset: 0, prop: 'close' }, rest)

    if (Array.isArray(symbol)) {
      if (isMeta) return 0
      return indicators.highest(len, symbol, { roll, offset })
    }


    if (isMeta) {
      zpEnv.addAsset(symbol, len + roll + offset)
      return roll ? [0] : 0
    }

    const data = getBars(zpEnv, symbol, len + roll + offset).map(b => b[prop])
    return indicators.highest(len, data, { roll, offset })
  })

  zpEnv.bind(ns + 'lowest', (len, symbol, rest: any = {}) => {
    const { roll, prop, offset } = r.mergeRight({ roll: 0, offset: 0, prop: 'close' }, rest)

    if (Array.isArray(symbol)) {
      if (isMeta) return 0
      return indicators.lowest(len, symbol, {})
    }


    if (isMeta) {
      zpEnv.addAsset(symbol, len + roll + offset)
      return roll ? [0] : 0
    }

    const data = getBars(zpEnv, symbol, len + roll + offset).map(b => b[prop])
    return indicators.lowest(len, data, { roll, offset })
  })

  // zpEnv.bind('donchian', (assets) => indicators.donchian(assets, assets.length))
  // zpEnv.bind('trueRange', (assets) => indicators.trueRange(assets))
}

export default {
  name,
  namespace,
  load
}
