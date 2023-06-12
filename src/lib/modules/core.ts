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
  env.bind('round', val => Math.round(val))
  env.bind('ceil', val => Math.ceil(val))
  env.bind('floor', val => Math.floor(val))
  env.bind('keys', (obj) => Object.keys(obj))
  env.bind('values', (obj) => Object.values(obj))
  env.bind('get', (key, obj) => obj[key])

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
  env.bind('filter', (fn, arr) => arr.filter(fn))
  env.bind('reduce', (fn, arr) => arr.reduce((curr, val) => {
    return (fn instanceof Lambda) ? fn.eval(env, [curr, val]) : fn(curr, val)
  }))
  env.bind('map', (fn, arr) => {
    return (fn instanceof Lambda) ? arr.map((val, i) => fn.eval(env, [val, i])) : arr.map(fn)
  })
  env.bind('first', arr => arr[0])
  env.bind('last', arr => arr[arr.length - 1])
  env.bind('nth', (idx, arr) => {
    function getIdx (i, a) {
      if (Array.isArray(i)) {
        const [curr, ...rest] = i
        return getIdx(rest.length > 1 ? rest : rest[0], a[curr])
      }

      return a[i]
    }

    return getIdx(idx, arr)
  })
}

export default {
  name,
  namespace,
  load
}
