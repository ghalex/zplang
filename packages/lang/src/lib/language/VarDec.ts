import type Env from './Env'
import type Variable from './Variable'

class VarDec {
  constructor (public variable: Variable, public initializer: any) {}

  eval (env: Env) {
    const val = this.initializer.eval(env)

    env.bind(this.variable.name, val)
    return val
  }

  toString () {
    return `(def ${this.variable.toString()} ${this.initializer.toString()})`
  }
}

export default VarDec
