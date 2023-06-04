
class Env {
  private readonly env: Record<string, any>

  constructor () {
    this.env = {}
  }

  bind (name: string, value: unknown) {
    this.env[name] = value
  }

  get (name: string) {
    if (!this.env[name]) {
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
