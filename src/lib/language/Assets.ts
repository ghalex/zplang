// import { evalExpression } from '../help'

import Variable from './Variable'

class Asset {
  constructor (public symbol: any, public window: any) {}

  eval (env) {
    const getBars = env.get('bars')
    const window = this.window instanceof Variable ? this.window.eval(env) : this.window
    const symbol = this.symbol instanceof Variable ? this.symbol.eval(env) : this.symbol.join('')

    if (!getBars) {
      throw new Error('"bars" function not defined')
    }

    env.addMeta('assets', symbol, Math.max(env.getMeta('assets')[symbol] ?? 1, window))

    try {
      return getBars(symbol, window)
    } catch (err: any) {
      throw new Error(err.message)
    }
  }

  toString () {
    return `{${this.symbol}, ${this.window}}`
  }
}

export default Asset
