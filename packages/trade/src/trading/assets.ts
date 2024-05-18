
const zpAssets = (env) => {
  const { bars } = env

  return {
    asset: (symbol: string, daysAgo: number = 0) => {
      if (!bars[symbol]) {
        throw new Error(`Bars for asset ${symbol} was not loaded`)
      }

      if (bars[symbol].length < daysAgo) {
        throw new Error(`Only ${bars[symbol].length} bars available for asset ${symbol} require ${daysAgo}`)
      }

      return bars[symbol][daysAgo]
    },

    assets: (symbol: string, window: number, daysAgo: number = 0) => {
      if (!bars[symbol]) {
        throw new Error(`Bars for asset ${symbol} was not loaded`)
      }

      if (bars[symbol].length < window) {
        throw new Error(`Only ${bars[symbol].length} bars available for asset ${symbol} require ${window}`)
      }

      return bars[symbol].slice(daysAgo, window + daysAgo)
    }
  }
}


export default zpAssets
