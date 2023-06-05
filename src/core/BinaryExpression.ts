import { evalExpression } from '../help'

class BinaryExpression {
  constructor (public op: string, public left: any, public right: any) {}

  eval (env) {
    const left = evalExpression(this.left, env)
    const right = evalExpression(this.right, env)

    return eval(left + this.op + right)
  }

  toString () {
    return `${this.left.toString()} ${this.op} ${this.right.toString()}`
  }
}

export default BinaryExpression
