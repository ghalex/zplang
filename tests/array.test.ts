import zp, { Env, modules } from '../src/lib'
// import * as fs from 'node:fs'

describe('array & objects', () => {
  test('defines an access arrays', () => {
    const env = new Env()
    env.loadModule(modules.core)

    const res = zp.evalCode(env, String.raw`
      (def arr1 [1, 2, 3])
      (len arr1)
      
      (push 5 arr1)
      (push! 4 arr1)
      arr1
    `)

    expect(res[0]).toEqual([1, 2, 3])
    expect(res[1]).toBe(3)
  })

  test('defines an access objects', () => {
    const env = new Env()
    env.loadModule(modules.core)

    const res = zp.evalCode(env, String.raw`
      (def obj1 {name: "My Name", age: 2})
      (keys obj1)

      ;; get age key
      (:age obj1)
      (:age! 22 obj1)
    `)

    expect(res[0]).toEqual({ name: 'My Name', age: 2 })
    expect(res[1]).toEqual(['name', 'age'])
    expect(res[2]).toEqual(2)
  })
})
