import * as core from '../modules'

interface Module {
  name: string
  namespace: string
  load: (env: Env, as?: string) => void
}

class Env {
  private readonly env: Record<string, any>
  private readonly parent: Env | null = null
  private readonly modules: Record<string, Module> = {}

  constructor (parent: Env | null = null) {
    this.parent = parent
    this.env = {
      $$bars: [],
      $$isMeta: false,
      $$meta: {
        assets: {}
      }
    }

    this.loadModule(core.core)
    this.loadModule(core.assets)

    this.registerModule(core.indicators)
    this.registerModule(core.trading)
  }

  bind (name: string, value: unknown) {
    const [a, b] = name.split('/')

    if (a && b) {
      this.env[a] = this.env[a] ?? {}
      this.env[a][b] = value

      return
    }

    this.env[a] = value
  }

  get (name: string) {
    const [a, b] = name.split('/')

    if (a && b) {
      if (this.env[a] === undefined) {
        throw new Error(`Module "${a}" not required`)
      }

      if (this.env[a][b] === undefined) {
        throw new Error(`"${b}" not defined`)
      }

      return this.env[a][b]
    }

    if (this.env[a] === undefined) {
      throw new Error(`"${a}" not defined`)
    }

    return this.env[a]
  }

  loadModule (m: Module, as?: string) {
    m.load(this, as)
  }

  loadModuleByName (name: string, as?: string) {
    const m = this.modules[name]

    if (!m) {
      throw new Error(`Module ${name} not registered`)
    }

    m.load(this, as)
  }

  registerModule (m: Module) {
    const ns = m.namespace + '/' + m.name
    this.modules[ns] = m
  }

  loadBars (bars = {}) {
    this.env.$$bars = bars
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

  getBars () {
    return this.env.$$bars
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
