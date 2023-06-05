import Lambda from './Lambda'

class FnDec {
  constructor (public args: string[], public expressions: any[]) {}

  eval () {
    return new Lambda(this.args, this.expressions)
  }

  toString () {
    return `(fn [${this.args.join(', ')}]: ${this.expressions.map(a => a.toString()).join(' ')})`
  }
}

export default FnDec
