import type Variable from './Variable'

class VarDec {
  constructor (public variable: Variable, public initializer: any) {
    Object.assign(this, { variable, initializer })
  }
}

export default VarDec
