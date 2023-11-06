import { evalExpression } from '../help'
import type Env from './Env'

class Let {
  constructor (public args: any[], public expressions: any[]) {}

  eval (env: Env) {
    const localEnv = env.duplicate()

    this.args.forEach(exp => evalExpression(exp, localEnv))
    return this.expressions.map(exp => evalExpression(exp, localEnv))
  }

  toString () {
    return `(let [${this.args.map(a => a.toString()).join(',')}] ${this.expressions.map(a => a.toString()).join(' ')})`
  }
}

export default Let
