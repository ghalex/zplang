import code from './code'
import data from './data'
import auth from './login'

const createApi = (config: any) => {
  return {
    code: code(config),
    data: data(config),
    auth: auth(config)
  }
}

export type Api = ReturnType<typeof createApi>
export default createApi