// import { evalExpression } from '../help'

import type Env from './Env'

class Import {
  constructor (public name: any, public as?: string) {}

  eval (env: Env) {
    const moduleName = this.name.eval(env)
    // env.loadModuleByName(moduleName, this.as)
    // return moduleName + (this.as ? ' :as ' + this.as : '')
    throw new Error('import not implemented')
  }

  toString () {
    if (this.as) {
      return `(import "${this.name}" :as ${this.as})`
    }

    return `(import "${this.name}")`
  }
}

export default Import
