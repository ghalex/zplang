
interface Module {
  name: string
  namespace: string
  load: (env: Env) => void
}

class Env {
  private readonly env: Record<string, any>
  private readonly parent: Env | null = null
  private readonly modules: Module[] = []

  constructor (parent: Env | null = null) {
    this.parent = parent
    this.env = {
      $$bars: [],
      $$meta: {
        assets: {}
      }
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

  loadModule (m: Module) {
    this.modules.push(m)
    m.load(this)
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
