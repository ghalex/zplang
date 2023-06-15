import { type Env } from '../language'

const name = 'assets'
const namespace = ''

const load = (env: Env) => {
  env.bind('bar', (symbol: string, daysAgo: number = 0) => {
    const data = env.getBars()

    if (!data[symbol]) {
      throw new Error(`Bars for asset ${symbol} was not loaded`)
    }

    if (data[symbol].length < daysAgo) {
      throw new Error(`Only ${data[symbol].length} bars available for asset ${symbol}`)
    }

    return data[symbol][daysAgo]
  })

  env.bind('bars', (symbol: string, window: number, daysAgo: number = 0) => {
    const data = env.getBars()

    if (!data[symbol]) {
      throw new Error(`Bars for asset ${symbol} was not loaded`)
    }

    if (data[symbol].length < window) {
      throw new Error(`Only ${data[symbol].length} bars available for asset ${symbol}`)
    }

    return data[symbol].slice(daysAgo, window + daysAgo)
  })
}

export default {
  name,
  namespace,
  load
}
