import { evalExpression } from '../help'

class List {
  constructor (public expressions: any) {}

  eval (env) {
    return this.expressions.map(e => evalExpression(e, env))
  }

  toString () {
    return '[' + this.expressions.join(' ') + ']'
  }
}

export default List
