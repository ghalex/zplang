import { evalExpression } from '../help'
import type Env from './Env'

class Loop {
  constructor (public id: any, public list: any, public block: any) {}

  eval (env: Env) {
    const localEnv = env.duplicate()
    const arr = Array.isArray(this.list) ? this.list : this.list.eval(env)

    if (!Array.isArray(arr)) throw new Error('List is not iterable')

    const results: any[] = []
    for (let i = 0; i < arr.length; i++) {
      if (this.id) {
        localEnv.bind(this.id, arr[i])
      }

      localEnv.bind('__idx', i)
      localEnv.bind('__value', arr[i])

      const out = this.block.map(e => evalExpression(e, localEnv))
      results.push(out)
    }

    return results
  }

  toString () {
    return `(loop [${this.id} in ${this.list.toString()}] ${this.block.toString()})`
  }
}

export default Loop
