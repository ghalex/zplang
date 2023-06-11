import { type Env, Lambda } from '../language'

const name = 'core'
const namespace = ''

const load = (env: Env) => {
  env.bind('+', (...args) => args.reduce((prev, curr) => prev + curr, 0))
  env.bind('-', (...args) => args.slice(1).reduce((prev, curr) => prev - curr, args[0]))
  env.bind('*', (...args) => args.slice(1).reduce((prev, curr) => prev * curr, args[0]))
  env.bind('/', (...args) => args.slice(1).reduce((prev, curr) => prev / curr, args[0]))
  env.bind('%', (a, b) => a % b)
  env.bind('**', (a, b) => a ** b)

  env.bind('>', (a, b) => a > b)
  env.bind('>=', (a, b) => a >= b)
  env.bind('=', (a, b) => a === b)
  env.bind('!=', (a, b) => a !== b)
  env.bind('<', (a, b) => a < b)
  env.bind('<=', (a, b) => a <= b)

  env.bind('inc', (val) => val + 1)
  env.bind('identity', (val) => val)

  // String
  env.bind('str', (...args) => args.map(a => a.toString()).join(' '))
  env.bind('print', (...args) => {
    console.log(...args)
    return args.join(' ')
  })

  // Array
  env.bind('length', arr => arr.length)
  env.bind('push', (val, arr) => [...arr, val])
  env.bind('pop', (arr) => arr.slice(0, -1))
  env.bind('map', (fn, arr) => {
    return (fn instanceof Lambda) ? arr.map((val, i) => fn.eval(env, [val, i])) : arr.map(fn)
  })
  env.bind('nth', (idx, arr) => {
    if (idx < 0) {
      return arr[arr.length + idx % arr.length]
    }

    return arr[idx % arr.length]
  })
}

export default {
  name,
  namespace,
  load
}
