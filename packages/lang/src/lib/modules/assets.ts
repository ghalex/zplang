import { type Env } from '../language'
import { createJsEnv } from '@zapcli/core'

const name = 'assets'
const namespace = 'core'

const load = (zpEnv: Env) => {
  const isMeta = zpEnv.get('$$isMeta')
  const bars = zpEnv.get('$$bars')
  const js = createJsEnv(bars)

  zpEnv.bind('bar',
    isMeta
      ? (symbol: string) => ({ symbol, open: 0, close: 0, low: 0, high: 0, volume: 0, date: 0 })
      : (symbol: string, daysAgo: number = 0) => js.asset(symbol, { daysAgo })
  )

  zpEnv.bind('bars',
    isMeta
      ? (symbol: string, window: number, daysAgo: number = 0) => [...Array(window + daysAgo).keys()].map(x => symbol)
      : (symbol: string, window: number, daysAgo: number = 0) => js.assets(symbol, window, { daysAgo })
  )
}

export default {
  name,
  namespace,
  load
}
