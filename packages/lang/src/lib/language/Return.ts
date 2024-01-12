import { evalExpression } from '../help'
import type Env from './Env'

class Return {
  constructor (public expression: any) {}

  eval (env: Env) {
    const localEnv = env.duplicate()

    return evalExpression(this.expression, localEnv)
  }

  toString () {
    return `(return ${this.expression.toString()})`
  }
}

export default Return
