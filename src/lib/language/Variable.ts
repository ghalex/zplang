import type Env from './Env'

class Variable {
  constructor (public name: string, public type: string) {}

  eval (env: Env) {
    // const evaled = evalLisp(this.arg, env)
    // env.bind(this.name, evaled)
    if (!env) throw Error('Env connot be undefined')
    return env.get(this.name)
  }

  toString () {
    return this.name
  }
}

export default Variable
