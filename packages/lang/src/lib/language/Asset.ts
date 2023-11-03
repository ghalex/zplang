// import { evalExpression } from '../help'

import type Env from './Env'
import Variable from './Variable'

class Asset {
  constructor (public symbol: any, public daysAgo: any) {}

  eval (env: Env) {
    const getBar = env.get('bar')
    const daysAgo = this.daysAgo instanceof Variable ? this.daysAgo.eval(env) : this.daysAgo
    const symbol = this.symbol instanceof Variable ? this.symbol.eval(env) : this.symbol

    if (!getBar) {
      throw new Error('"bar" function not defined')
    }

    // add assets
    env.addAsset(symbol, daysAgo)

    try {
      return getBar(symbol, daysAgo)
    } catch (err: any) {
      throw new Error(err.message)
    }
  }

  toString () {
    const symbol = this.symbol instanceof Variable ? this.symbol.toString() : this.symbol

    if (this.daysAgo < 1) {
      return `{${symbol}}`
    }

    return `{${symbol}, ${this.daysAgo} days ago}`
  }
}

export default Asset
