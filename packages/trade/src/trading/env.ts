import zpAssets from './assets'
import zpCore from './core'
import zpTrade from './trade'

const createEnv = (bars: any) => {
  const env = {
    bars,
    settings: {},
    stdout: [] as string[],
  }

  return {
    ...env,
    ...zpCore(env),
    ...zpAssets(env),
    ...zpTrade(env)
  }
}

export default createEnv