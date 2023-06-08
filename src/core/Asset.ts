// import { evalExpression } from '../help'

class Asset {
  constructor (public symbol: any, public window: number = 1) {}

  eval (env) {
    const getBars = env.get('bars')

    if (!getBars) {
      throw new Error('"bars" function not defined')
    }

    const bars = getBars(this.symbol, this.window)

    if (bars.length === 0) {
      return null
    }

    if (bars.length === 1) {
      return bars[0]
    }

    return bars
  }

  toString () {
    if (this.window <= 1) {
      return `{${this.symbol}}`
    }

    return `{${this.symbol}, ${this.window}}`
  }
}

export default Asset
