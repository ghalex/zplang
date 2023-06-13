// import { evalExpression } from '../help'

class ObjSet {
  constructor (public id: any, public value: any, public variable: any, public write: boolean = false) {}

  eval (env) {
    const value = this.value.eval(env)
    const obj = this.variable.eval(env)

    if (Array.isArray(obj)) {
      const x = this.write ? obj : obj.concat()
      return x.map(o => ({ ...obj, [this.id]: value }))
    }

    if (this.write) {
      obj[this.id] = value
      return obj
    }

    return { ...obj, [this.id]: value }
  }

  toString () {
    return `(:${this.id} ${this.value} ${this.variable.name})`
  }
}

export default ObjSet
