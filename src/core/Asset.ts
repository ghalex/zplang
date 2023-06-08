// import { evalExpression } from '../help'

class Asset {
  constructor (public symbol: any, public daysAgo: number = 0) {}

  eval (env) {
    const getBar = env.get('bar')

    if (!getBar) {
      throw new Error('"bar" function not defined')
    }

    try {
      return getBar(this.symbol, this.daysAgo)
    } catch (err: any) {
      throw new Error(err.message)
    }
  }

  toString () {
    if (this.daysAgo < 1) {
      return `{${this.symbol}}`
    }

    return `{${this.symbol}, ${this.daysAgo} days ago}`
  }
}

export default Asset
