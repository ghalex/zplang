import { evalExpression } from '../help'

class Expression {
  constructor (public value: any) {}

  eval (env) {
    return evalExpression(this.value, env)
  }

  toString () {
    return this.value.toString()
  }
}

export default Expression
