import type Env from './Env'

class Strlit {
  constructor (public value: string) {}

  eval (env: Env) {
    return this.value
  }

  toString () {
    return '"' + this.value + '"'
  }
}

export default Strlit
