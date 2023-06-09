// import { evalExpression } from '../help'

import type Env from './Env'
import Variable from './Variable'

class Asset {
  constructor (public symbol: any, public daysAgo: any) {}

  eval (env: Env) {
    const getBar = env.get('bar')
    const daysAgo = this.daysAgo instanceof Variable ? this.daysAgo.eval(env) : this.daysAgo

    if (!getBar) {
      throw new Error('"bar" function not defined')
    }

    // add meta
    env.addMeta('assets', this.symbol, Math.max(env.getMeta('assets')[this.symbol] ?? 1, daysAgo))

    try {
      return getBar(this.symbol, daysAgo)
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
