// import { evalExpression } from '../help'
import { evalExpression } from '../help'
import type Env from './Env'

class Lambda {
  constructor (public bindNames: string[], public body: any[]) {}

  eval (env: Env, args: any[] = []) {
    const localEnv = env.duplicate()

    args.forEach((arg, i) => {
      if (this.bindNames[i] !== undefined) {
        const bindName = this.bindNames[i].toString()
        const value = evalExpression(arg, env)

        localEnv.bind(bindName, value)
      }
    })

    const evaled = this.body.map(exp => {
      return evalExpression(exp, localEnv)
    })

    return evaled[evaled.length - 1]
  }
}

export default Lambda
