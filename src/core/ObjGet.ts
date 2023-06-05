// import { evalExpression } from '../help'

class ObjGet {
  constructor (public id: any, public variable: any) {}

  eval (env) {
    const obj = this.variable.eval(env)

    if (obj[this.id] === undefined) throw Error(`Key "${this.id}" not defined in object ${this.variable.name}`)

    return obj[this.id]
  }

  toString () {
    return '(:' + this.id + ' ' + this.variable.name + ')'
  }
}

export default ObjGet
