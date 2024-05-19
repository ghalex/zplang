import { type Env } from '../language'
import { createJsEnv } from 'zptrade'
import * as r from 'ramda'

const name = 'indicators'
const namespace = 'core'

const load = (zpEnv: Env, as: string = '') => {
  const isMeta = zpEnv.get('$$isMeta')
  const bars = zpEnv.get('$$bars')

  const ns = as.length > 0 ? as + '/' : ''
  const js = createJsEnv(bars)

  const handleMeta = (factor = 1) => (len, symbol, rest) => {
    if (Array.isArray(symbol)) {
      return 0
    }

    const { roll, offset } = r.mergeRight({ roll: 0, offset: 0 }, rest)
  
    zpEnv.addAsset(symbol, (len * factor) + roll + offset)
    return roll ? [0] : 0
  }

  // Indicators
  zpEnv.bind(ns + 'sma', isMeta ? handleMeta() : js.sma)
  zpEnv.bind(ns + 'ema', isMeta ? handleMeta(2) : js.ema)
  zpEnv.bind(ns + 'rsi', isMeta ? handleMeta() : js.rsi)
  zpEnv.bind(ns + 'mm', isMeta ? handleMeta() : js.momentum)
  zpEnv.bind(ns + 'atr', isMeta ? handleMeta() : js.atr)
  zpEnv.bind(ns + 'cmr', isMeta ? handleMeta() : js.cmr)
  zpEnv.bind(ns + 'std', isMeta ? handleMeta() : js.std)
  zpEnv.bind(ns + 'highest', isMeta ? handleMeta() : js.highest)
  zpEnv.bind(ns + 'lowest', isMeta ? handleMeta() : js.lowest)
  zpEnv.bind(ns + 'donchian', isMeta ? handleMeta() : js.donchian)
  // zpEnv.bind('trueRange', (assets) => indicators.trueRange(assets))
}

export default {
  name,
  namespace,
  load
}
