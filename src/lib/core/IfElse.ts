import { evalExpression } from '../help'

class IfElse {
  constructor (public expression: any, public yesStmt: any, public noStmt: any) {}

  eval (env) {
    const cond = evalExpression(this.expression, env)

    if (cond === false || cond === null || cond === undefined) {
      if (this.noStmt.length > 0) {
        return evalExpression(this.noStmt[0], env)
      } else {
        return null
      }
    }

    return evalExpression(this.yesStmt, env)
  }

  toString () {
    return `(if [${this.expression.toString()}] ${this.yesStmt.toString()} ${this.noStmt.toString()})`
  }
}

export default IfElse
