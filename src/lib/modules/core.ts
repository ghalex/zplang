import { Lambda, type Env } from '../language'
import * as r from 'ramda'

const name = 'core'
const namespace = ''

const load = (env: Env) => {
  env.bind('+', (...args) => args.reduce((prev, curr) => prev + curr, 0))
  env.bind('-', (...args) => args.slice(1).reduce((prev, curr) => prev - curr, args[0]))
  env.bind('*', (...args) => args.slice(1).reduce((prev, curr) => prev * curr, args[0]))
  env.bind('/', (...args) => args.slice(1).reduce((prev, curr) => prev / curr, args[0]))
  env.bind('%', (a, b) => a % b)
  env.bind('**', (a, b) => a ** b)

  env.bind('>', r.curry((a, b) => a > b))
  env.bind('>=', r.curry((a, b) => a >= b))
  env.bind('=', r.curry((a, b) => a === b))
  env.bind('!=', r.curry((a, b) => a !== b))
  env.bind('<', r.curry((a, b) => a < b))
  env.bind('<=', r.curry((a, b) => a <= b))
  env.bind('not', (a) => !a)
  env.bind('and', (a, b) => a && b)

  env.bind('inc', (val) => val + 1)
  env.bind('identity', (val) => val)
  env.bind('round', val => Math.round(val))
  env.bind('ceil', val => Math.ceil(val))
  env.bind('floor', val => Math.floor(val))
  env.bind('keys', (obj) => Object.keys(obj))
  env.bind('values', (obj) => Object.values(obj))

  env.bind('get', (key: string, obj) => r.path(key.split('.'))(obj))
  env.bind('set', (obj1, obj2) => ({ ...obj2, ...obj1 }))
  // String
  env.bind('str', (...args) => args.map(a => a.toString()).join(' '))
  env.bind('print', (...args) => {
    console.log(...args)
    return args.join(' ')
  })

  env.bind('call', (fn, ...rest) => {
    if (!fn) throw new Error('Cannot call function')
    return fn(...rest)
  })

  // Array
  env.bind('len', arr => arr.length)
  env.bind('indexOf', (el, arr) => arr.indexOf(el))
  env.bind('push', (val, arr) => [...arr, val])
  env.bind('push!', (val, arr) => arr.push(val))
  env.bind('pop', (arr) => arr.slice(0, -1))
  env.bind('pop!', (arr) => arr.pop())
  env.bind('shift', (arr) => arr.slice(1))
  env.bind('shift!', (arr) => arr.shift())
  env.bind('filter', (lamda, arr) => {
    return lamda instanceof Lambda ? arr.filter(val => lamda.eval(env, [val])) : arr.filter(lamda)
  })
  env.bind('take', (val, arr) => r.take(val, arr))

  env.bind('sortBy', (fn, arr) => {
    return r.sortBy(val => fn.eval(env, [val]), arr)
  })

  env.bind('reduce', (lamda, arr) => {
    return arr.reduce((curr, val) => {
      return lamda instanceof Lambda ? lamda.eval(env, [curr, val]) : lamda(curr, val)
    })
  })

  env.bind('some', (lamda, arr) => {
    return arr.some((val, idx) => {
      return lamda instanceof Lambda ? lamda.eval(env, [val, idx]) : lamda(val, idx)
    })
  })

  env.bind('size', (arr) => arr.length)

  env.bind('map', (lamda, arr) => arr.map((val, i) => lamda.eval(env, [val, i])))
  env.bind('first', arr => arr[0])
  env.bind('last', arr => arr[arr.length - 1])
  env.bind('nth', (idx, arr) => {
    function getIdx (i, a) {
      if (Array.isArray(i)) {
        const [curr, ...rest] = i
        return getIdx(rest.length > 1 ? rest : rest[0], a[curr])
      }

      if (i < 0) {
        return a[(a.length + i) % a.length]
      }

      return a[i % a.length]
    }

    return getIdx(idx, arr)
  })
}

export default {
  name,
  namespace,
  load
}
