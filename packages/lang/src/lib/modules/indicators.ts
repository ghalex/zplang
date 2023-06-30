import { type Env } from '../language'
import zpcore from '@zapant/core'
import * as r from 'ramda'

const name = 'indicators'
const namespace = 'core'

const addWindow = (env, symbol, window) => {
  env.addMeta('assets', symbol, Math.max(env.getMeta('assets')[symbol] ?? 1, window))
}

const getBars = (env, symbol, window) => {
  const fn = env.get('bars')
  return fn(symbol, window)
}

const load = (zpEnv: Env, as: string = '') => {
  const isMeta = zpEnv.get('$$isMeta')
  const ns = as.length > 0 ? as + '/' : ''

  // Simple Moving Avg
  zpEnv.bind(ns + 'sma', (len, symbol, rest: any = {}) => {
    if (Array.isArray(len)) {
      if (isMeta) return 0
      return zpcore.sma(len.length, len.map(x => x.close), {})
    }

    const { roll, prop, offset } = r.mergeRight({ roll: 0, offset: 0, prop: 'close' }, rest)

    if (isMeta) {
      addWindow(zpEnv, symbol, len + roll + offset)
      return roll ? [0] : 0
    }

    const data = getBars(zpEnv, symbol, len + roll + offset).map(b => b[prop])
    return zpcore.sma(len, data, { roll, offset })
  })

  // Exponential moving averange
  zpEnv.bind(ns + 'ema', (len, symbol, rest: any = {}) => {
    if (Array.isArray(len)) {
      if (isMeta) return 0
      return zpcore.ema(len.length / 2, len, {})
    }

    const { roll, prop, offset } = r.mergeRight({ roll: 0, offset: 0, prop: 'close' }, rest)

    if (isMeta) {
      addWindow(zpEnv, symbol, len * 2 + roll + offset)
      return roll ? [0] : 0
    }

    const data = getBars(zpEnv, symbol, len * 2 + roll + offset).map(b => b[prop])
    return zpcore.ema(len, data, { roll, offset })
  })

  // Momentum Squeeze
  zpEnv.bind(ns + 'mms', (len, symbol, rest: any = {}) => {
    if (Array.isArray(len)) {
      if (isMeta) return 0
      return zpcore.mms(len.length / 2, len, {})
    }

    const { roll, offset } = r.mergeRight({ roll: 0, offset: 0, prop: 'close' }, rest)
    if (isMeta) {
      addWindow(zpEnv, symbol, len * 2 + roll + offset)
      return roll ? [0] : 0
    }

    const data = getBars(zpEnv, symbol, len * 2 + roll + offset)
    return zpcore.mms(len, data, { roll, offset })
  })

  zpEnv.bind(ns + 'mm', (len, symbol, rest: any = {}) => {
    if (Array.isArray(len)) {
      if (isMeta) return 0
      return zpcore.momentum(len.length, len.map(x => x.close), {})
    }

    const { roll, prop, offset } = r.mergeRight({ roll: 0, offset: 0, prop: 'close' }, rest)

    if (isMeta) {
      addWindow(zpEnv, symbol, len + roll + offset)
      return roll ? [0] : 0
    }

    const data = getBars(zpEnv, symbol, len + roll + offset).map(b => b[prop])
    return zpcore.momentum(len, data, { roll, offset })
  })

  // Averange True Range
  zpEnv.bind(ns + 'atr', (len, symbol, rest: any = {}) => {
    if (Array.isArray(len)) {
      if (isMeta) return 0
      return zpcore.atr(len.length, len, {})
    }

    const { roll, offset } = r.mergeRight({ roll: 0, offset: 0, prop: 'close' }, rest)

    if (isMeta) {
      addWindow(zpEnv, symbol, len + roll + offset + 1)
      return roll ? [0] : 0
    }

    const data = getBars(zpEnv, symbol, len + roll + offset + 1)
    return zpcore.atr(len, data, { roll, offset })
  })

  // Cummulative return
  zpEnv.bind(ns + 'cmr', (len, symbol, rest: any = {}) => {
    if (Array.isArray(len)) {
      if (isMeta) return 0
      return zpcore.cmr(len.length, len.map(x => x.close), {})
    }

    const { roll, offset, prop } = r.mergeRight({ roll: 0, offset: 0, prop: 'close' }, rest)

    if (isMeta) {
      addWindow(zpEnv, symbol, len + roll + offset + 1)
      return roll ? [0] : 0
    }

    const data = getBars(zpEnv, symbol, len + roll + offset + 1).map(b => b[prop])
    return zpcore.cmr(len, data, { roll, offset })
  })

  // Standard deviation
  zpEnv.bind(ns + 'std', (len, symbol, rest: any = {}) => {
    if (Array.isArray(len)) {
      if (isMeta) return 0
      return zpcore.std(len.length, len.map(x => x.close), {})
    }

    const { roll, prop, offset } = r.mergeRight({ roll: 0, offset: 0, prop: 'close' }, rest)

    if (isMeta) {
      addWindow(zpEnv, symbol, len + roll + offset)
      return roll ? [0] : 0
    }

    const data = getBars(zpEnv, symbol, len + roll + offset).map(b => b[prop])
    return zpcore.std(len, data, { roll, offset })
  })

  zpEnv.bind(ns + 'highest', (len, symbol, rest: any = {}) => {
    if (Array.isArray(len)) {
      if (isMeta) return 0
      return zpcore.highest(len.length, len.map(x => x.close), {})
    }

    const { roll, prop, offset } = r.mergeRight({ roll: 0, offset: 0, prop: 'close' }, rest)

    if (isMeta) {
      addWindow(zpEnv, symbol, len + roll + offset)
      return roll ? [0] : 0
    }

    const data = getBars(zpEnv, symbol, len + roll + offset).map(b => b[prop])
    return zpcore.highest(len, data, { roll, offset })
  })

  zpEnv.bind(ns + 'lowest', (len, symbol, rest: any = {}) => {
    if (Array.isArray(len)) {
      if (isMeta) return 0
      return zpcore.lowest(len.length, len.map(x => x.close), {})
    }

    const { roll, prop, offset } = r.mergeRight({ roll: 0, offset: 0, prop: 'close' }, rest)

    if (isMeta) {
      addWindow(zpEnv, symbol, len + roll + offset)
      return roll ? [0] : 0
    }

    const data = getBars(zpEnv, symbol, len + roll + offset).map(b => b[prop])
    return zpcore.lowest(len, data, { roll, offset })
  })

  // zpEnv.bind('donchian', (assets) => indicators.donchian(assets, assets.length))
  // zpEnv.bind('trueRange', (assets) => indicators.trueRange(assets))
}

export default {
  name,
  namespace,
  load
}
