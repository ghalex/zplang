import { evalExpression } from '../help'
import type Env from './Env'

class Let {
  constructor (public expressions: any[]) {}

  eval (env: Env) {
    const localEnv = env.duplicate()
    return this.expressions.map(exp => evalExpression(exp, localEnv))
  }

  toString () {
    return `(let ${this.expressions.map(a => a.toString()).join(' ')})`
  }
}

export default Let
