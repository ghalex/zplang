import { evalExpression } from '../help'

class Obj {
  constructor (public body: any) {}

  eval (env) {
    const res = {}

    this.body.forEach(([key, exp]) => {
      res[key] = evalExpression(exp, env)
    })

    return res
  }

  toString () {
    return '{' + this.body.map(([key, exp]) => key + ':' + exp.toString()).join(', ') + '}'
  }
}

export default Obj
