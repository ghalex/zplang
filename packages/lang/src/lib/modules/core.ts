import { Lambda, type Env } from '../language'
import * as r from 'ramda'

const name = 'base'
const namespace = 'core'

const arrApply = (fn, arr1, arr2) => {
  return arr1.map((val, i) => {
    return fn(val, arr2[i])
  })
}

const load = (env: Env) => {

  env.bind('+', (...args) => {
    const isArray = Array.isArray(args[0])
    return args.slice(1).reduce((prev, curr) => isArray ? arrApply(r.add, prev, curr) : prev + curr, args[0])
  })

  env.bind('-', (...args) => {
    const isArray = Array.isArray(args[0])
    return args.slice(1).reduce((prev, curr) => isArray ? arrApply(r.subtract, prev, curr) : prev - curr, args[0])
  })

  env.bind('*', (...args) => {
    const isArray = Array.isArray(args[0])
    return args.slice(1).reduce((prev, curr) => isArray ? arrApply(r.multiply, prev, curr) : prev * curr, args[0])
  })
  
  env.bind('/', (...args) => {
    const isArray = Array.isArray(args[0])
    return args.slice(1).reduce((prev, curr) => isArray ? arrApply(r.divide, prev, curr) : prev / curr, args[0])
  })

  env.bind('%', (a, b) => {
    const isArray = Array.isArray(a)
    return isArray ? arrApply((x, y) => x % y, a, b) : a % b
  })

  env.bind('**', (a, b) => {
    const isArray = Array.isArray(a)
    return isArray ? arrApply((x, y) => x ** y, a, b) : a ** b
  })

  env.bind('=', (a, b) => {
    const isArray = Array.isArray(a)
    return isArray ? arrApply((x, y) => x === y, a, b) : a === b
  })

  env.bind('arrApply', (fn, arr1, arr2) => {
    return arrApply(fn, arr1, arr2)
  })

  env.bind('isNil', (val) => val === undefined || val === null)
  env.bind('>', (a, b) => a > b)
  env.bind('>=', (a, b) => a >= b)
  env.bind('!=', (a, b) => a !== b)
  env.bind('<', (a, b) => a < b)
  env.bind('<=', (a, b) => a <= b)

  env.bind('??', (val, defaultValue) => val !== undefined && val !== null ? val : defaultValue)
  env.bind('not', (a) => !a)
  env.bind('and', (...args) => args.every(a => a))
  env.bind('or', (...args) => args.some(a => a))
  env.bind('abs', (val) => Math.abs(val))
  env.bind('log', (val) => Math.log(val))

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
    obj1 = { ...obj1, ...obj2 }
  })

  // Math
  env.bind('max', (arr) => Array.isArray(arr) ? Math.max(...arr) : Math.max(arr))
  env.bind('min', (arr) => Array.isArray(arr) ? Math.min(...arr) : Math.min(arr))

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
  env.bind('reverse', (arr) => arr.reverse())
  env.bind('concat', (arr1, arr2) => arr1.concat(arr2))
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
  env.bind('first', arr => {
    if (arr.length === 0) return null
    return arr[0]
  })

  env.bind('last', arr => {
    if (arr.length === 0) return null
    return arr[arr.length - 1]
  })
  
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
