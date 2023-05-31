
class FnCall {
  constructor (public name: string, public args: any[]) {}

  eval () {
    // return new Lambda(this.bindNames, this.body)
    return 'not implemented'
  }

  toString () {
    return `(${this.name}: ${this.args.join(' ')})`
  }
}

export default FnCall
