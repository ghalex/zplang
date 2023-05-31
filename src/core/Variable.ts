import type Env from './Env'

class Variable {
  constructor (public name: string, public type: string) {}

  eval (env: Env) {
    const evaled = evalLisp(this.arg, env)
    env.bind(this.name, evaled)
  }
}

export default Variable
