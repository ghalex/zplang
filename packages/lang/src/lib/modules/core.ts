import { Lambda, type Env } from '../language'
import * as r from 'ramda'

const name = 'base'
const namespace = 'core'

const load = (env: Env) => {
  env.bind('+', (...args) => args.reduce((prev, curr) => prev + curr, 0))
  env.bind('-', (...args) => args.slice(1).reduce((prev, curr) => prev - curr, args[0]))
  env.bind('*', (...args) => args.slice(1).reduce((prev, curr) => prev * curr, args[0]))
  env.bind('/', (...args) => args.slice(1).reduce((prev, curr) => prev / curr, args[0]))
  env.bind('%', (a, b) => a % b)
  env.bind('**', (a, b) => a ** b)
  env.bind('??', (val, defaultValue) => val !== undefined && val !== null ? val : defaultValue)

  env.bind('>', r.curry((a, b) => a > b))
  env.bind('>=', r.curry((a, b) => a >= b))
  env.bind('=', r.curry((a, b) => a === b))
  env.bind('!=', r.curry((a, b) => a !== b))
  env.bind('<', r.curry((a, b) => a < b))
  env.bind('<=', r.curry((a, b) => a <= b))
  env.bind('not', (a) => !a)
  env.bind('and', (...args) => args.every(a => a))
  env.bind('or', (...args) => args.some(a => a))

  env.bind('inc', (val) => val + 1)
  env.bind('identity', (val) => val)
  env.bind('round', val => Math.round(val))
  env.bind('ceil', val => Math.ceil(val))
  env.bind('floor', val => Math.floor(val))
  env.bind('keys', (obj) => Object.keys(obj))
  env.bind('values', (obj) => Object.values(obj))
  env.bind('json', val => JSON.stringify(val, null, 2))
  env.bind('get', (key: string, obj) => r.path(key.split('.'))(obj))
  env.bind('set', (obj1, obj2) => ({ ...obj2, ...obj1 }))
  env.bind('set!', (obj1, obj2) => {
    console.log('in set ', obj1, obj2)
    obj1 = { ...obj1, ...obj2 }
  })

  // String
  env.bind('str', (...args) => args.map(a => a.toString()).join(' '))
  env.bind('clear', () => { env.clear() })
  env.bind('print', (...args) => {
    const str = args.join('')
    env.print(str)
    return str
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
  env.bind('take', (val, arr) => val > 0 ? r.take(val, arr) : r.takeLast(Math.abs(val), arr))

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

  env.bind('every', (lamda, arr) => arr.every(val => lamda.eval(env, [val])))
  env.bind('some', (lamda, arr) => arr.some(val => lamda.eval(env, [val])))
  env.bind('size', (arr) => arr.length)
  env.bind('count', (arr: any[]) => arr.length)
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
