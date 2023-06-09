import Lambda from './Lambda'

class Env {
  private readonly env: Record<string, any>
  private readonly parent: Env | null = null

  constructor (data: Record<string, any> = [], parent: Env | null = null) {
    this.parent = parent
    this.env = {
      $$meta: {
        assets: {}
      }
    }

    this.env['+'] = (...args) => args.reduce((prev, curr) => prev + curr, 0)
    this.env['-'] = (...args) => args.slice(1).reduce((prev, curr) => prev - curr, args[0])
    this.env['*'] = (...args) => args.slice(1).reduce((prev, curr) => prev * curr, args[0])
    this.env['/'] = (...args) => args.slice(1).reduce((prev, curr) => prev / curr, args[0])
    this.env['inc'] = (val) => val + 1
    this.env['identity'] = (val) => val

    // String
    this.env['str'] = (...args) => args.map(a => a.toString()).join(' ')
    this.env['print'] = (...args) => {
      console.log(...args)
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

    // Assets
    this.env['bar'] = (symbol: string, daysAgo: number = 0) => {
      if (!data[symbol]) {
        throw new Error(`Bars for asset ${symbol} was not loaded`)
      }

      if (data[symbol].length < daysAgo) {
        throw new Error(`Only ${data[symbol].length} bars available for asset ${symbol}`)
      }

      return data[symbol][daysAgo]
    }

    this.env['bars'] = (symbol: string, window: number) => {
      if (!data[symbol]) {
        throw new Error(`Bars for asset ${symbol} was not loaded`)
      }

      if (data[symbol].length < window) {
        throw new Error(`Only ${data[symbol].length} bars available for asset ${symbol}`)
      }

      return data[symbol].slice(0, window)
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

  addMeta (category: string, key: string, value: unknown) {
    if (this.parent) {
      this.parent.addMeta(category, key, value)
    } else {
      this.env.$$meta[category][key] = value
    }
  }

  getMeta (key: string) {
    return this.env.$$meta[key]
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
