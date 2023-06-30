import { evalExpression } from '../help'

class Expression {
  constructor (public value: any) {}

  eval (env) {
    return evalExpression(this.value, env)
  }

  toString () {
    if (this.value === null) {
      return 'null'
    }

    return this.value.toString()
  }
}

export default Expression
