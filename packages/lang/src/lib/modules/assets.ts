import { type Env } from '../language'

const name = 'assets'
const namespace = 'core'

const load = (zpEnv: Env) => {
  const isMeta = zpEnv.get('$$isMeta')
  zpEnv.bind('bar', (symbol: string, daysAgo: number = 0) => {
    if (isMeta) {
      return { symbol, open: 0, close: 0, low: 0, high: 0, volume: 0, date: 0 }
    }

    const data = zpEnv.getBars()

    if (!data[symbol]) {
      throw new Error(`Bars for asset ${symbol} was not loaded`)
    }

    if (data[symbol].length < daysAgo) {
      throw new Error(`Only ${data[symbol].length} bars available for asset ${symbol} require ${daysAgo}`)
    }

    return data[symbol][daysAgo]
  })

  zpEnv.bind('bars', (symbol: string, window: number, daysAgo: number = 0) => {
    if (isMeta) {
      return [...Array(window + daysAgo).keys()].map(x => symbol)
    }

    const data = zpEnv.getBars()

    if (!data[symbol]) {
      throw new Error(`Bars for asset ${symbol} was not loaded`)
    }

    if (data[symbol].length < window) {
      throw new Error(`Only ${data[symbol].length} bars available for asset ${symbol} require ${daysAgo}`)
    }

    return data[symbol].slice(daysAgo, window + daysAgo)
  })
}

export default {
  name,
  namespace,
  load
}
