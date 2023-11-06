import { evalExpression } from '../help'
import type Env from './Env'

class Pragma {
  constructor (public key: string, public exp: any) {}

  eval (env: Env) {
    const val = evalExpression(this.exp, env)
    env.setPragma(this.key, val)

    return [this.key, val]
  }

  toString () {
    return `#pragma ${this.key} ${this.exp}`
  }
}

export default Pragma
