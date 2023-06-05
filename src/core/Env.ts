import Lambda from './Lambda'

class Env {
  private readonly env: Record<string, any>

  constructor () {
    this.env = {}
    this.env['+'] = (...args) => args.reduce((prev, curr) => prev + curr, 0)
    this.env['-'] = (...args) => args.slice(1).reduce((prev, curr) => prev - curr, args[0])
    this.env['*'] = (...args) => args.slice(1).reduce((prev, curr) => prev * curr, args[0])
    this.env['/'] = (...args) => args.slice(1).reduce((prev, curr) => prev / curr, args[0])
    this.env['inc'] = (val) => val + 1

    // String
    this.env['str'] = (...args) => args.join(' ')
    this.env['print'] = (...args) => {
      console.log('#user> ', ...args)
      return args.join(' ')
    }

    // Array
    this.env['length'] = arr => arr.length
    this.env['push'] = (val, arr) => [...arr, val]
    this.env['pop'] = (arr) => arr.slice(0, -1)
    this.env['map'] = (fn, arr) => {
      return (fn instanceof Lambda) ? arr.map((val, i) => fn.eval(this, [val, i])) : arr.map(fn)
    }
    this.env['nth'] = (idx, arr) => {
      if (idx < 0) {
        return arr[arr.length + idx % arr.length]
      }

      return arr[idx % arr.length]
    }
  }

  bind (name: string, value: unknown) {
    this.env[name] = value
  }

  get (name: string) {
    if (this.env[name] === undefined) {
      throw new Error(`"${name}" not defined`)
    }

    return this.env[name]
  }

  // this could be replaced with parentEnv and "looking up" if something is not found
  duplicate () {
    const dupEnv = new Env()

    Object.entries(this.env).forEach(([key, value]) => {
      dupEnv.bind(key, value)
    })

    return dupEnv
  }
}

export default Env
