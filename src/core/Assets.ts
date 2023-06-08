// import { evalExpression } from '../help'

class Asset {
  constructor (public symbol: any, public window: number) {}

  eval (env) {
    const getBars = env.get('bars')

    if (!getBars) {
      throw new Error('"bars" function not defined')
    }

    try {
      return getBars(this.symbol, this.window)
    } catch (err: any) {
      throw new Error(err.message)
    }
  }

  toString () {
    return `{${this.symbol}, ${this.window}}`
  }
}

export default Asset
