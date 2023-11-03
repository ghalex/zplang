// import { evalExpression } from '../help'

import Variable from './Variable'

class Assets {
  constructor (public symbol: any, public window: any, public daysAgo: any) {}

  eval (env) {
    const getBars = env.get('bars')
    const window = this.window instanceof Variable ? this.window.eval(env) : this.window
    const daysAgo = this.daysAgo instanceof Variable ? this.daysAgo.eval(env) : this.daysAgo
    const symbol = this.symbol instanceof Variable ? this.symbol.eval(env) : this.symbol

    if (!getBars) {
      throw new Error('"bars" function not defined')
    }

    // add assets
    env.addAsset(symbol, window + daysAgo)

    try {
      return getBars(symbol, window, daysAgo)
    } catch (err: any) {
      throw new Error(err.message)
    }
  }

  toString () {
    const symbol = this.symbol instanceof Variable ? this.symbol.toString() : this.symbol
    return `{${symbol}, ${this.window}}`
  }
}

export default Assets
