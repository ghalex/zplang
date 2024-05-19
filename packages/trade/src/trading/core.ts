import { pluck, head, take } from 'ramda'

const zpCore = (env) => {
  const { stdout } = env

  return {
    pluck,
    head,
    take,
    print: (...args) => {
      const str = args.map(x => typeof x === 'string' ? x : JSON.stringify(x, null, 2)).join(' ')
      stdout.push(str)
      return str
    }
  }
}

export default zpCore
