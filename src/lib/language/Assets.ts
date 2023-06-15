// import { evalExpression } from '../help'

import Variable from './Variable'

class Asset {
  constructor (public symbol: any, public window: any, public daysAgo: any) {}

  eval (env) {
    const getBars = env.get('bars')
    const window = this.window instanceof Variable ? this.window.eval(env) : this.window
    const daysAgo = this.daysAgo instanceof Variable ? this.daysAgo.eval(env) : this.daysAgo
    const symbol = this.symbol instanceof Variable ? this.symbol.eval(env) : this.symbol.join('')

    console.log(daysAgo)
    if (!getBars) {
      throw new Error('"bars" function not defined')
    }

    env.addMeta('assets', symbol, Math.max(env.getMeta('assets')[symbol] ?? 1, window + daysAgo))

    try {
      return getBars(symbol, window, daysAgo)
    } catch (err: any) {
      throw new Error(err.message)
    }
  }

  toString () {
    const symbol = this.symbol instanceof Variable ? this.symbol.toString() : this.symbol.join('')
    return `{${symbol}, ${this.window}}`
  }
}

export default Asset
