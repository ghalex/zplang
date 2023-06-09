// import { evalExpression } from '../help'

import Variable from './Variable'

class Asset {
  constructor (public symbol: any, public window: any) {}

  eval (env) {
    const getBars = env.get('bars')
    const window = this.window instanceof Variable ? this.window.eval(env) : this.window

    if (!getBars) {
      throw new Error('"bars" function not defined')
    }

    env.addMeta('assets', this.symbol, Math.max(env.getMeta('assets')[this.symbol] ?? 1, window))

    try {
      return getBars(this.symbol, window)
    } catch (err: any) {
      throw new Error(err.message)
    }
  }

  toString () {
    return `{${this.symbol}, ${this.window}}`
  }
}

export default Asset
