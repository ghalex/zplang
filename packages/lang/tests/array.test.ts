import zp, { Env } from '../src/lib'
// import * as fs from 'node:fs'

describe('array & objects', () => {
  test('defines an access arrays', () => {
    const env = new Env()

    const res = zp.evalCode(env, String.raw`
      (def arr1 [1, 2, 3])
      (len arr1)
      
      (nth 1 arr1)
      arr1[0]

      (> arr1[-1] 2)
    `)

    expect(res[0]).toEqual([1, 2, 3])
    expect(res[1]).toBe(3)
    expect(res[2]).toBe(2)
    expect(res[3]).toBe(1)
    expect(res[4]).toBe(true)
  })

  test('array functions', () => {
    const env = new Env()

    const res = zp.evalCode(env, String.raw`
      (def arr1 [1, 2, 3])
      
      (push 5 arr1)
      (push! 4 arr1)

      (defn big2 [val] (> val 2))
      (filter big2 arr1)

      (map (fn [x] (* x 2)) arr1)
    `)

    expect(res[1]).toEqual([1, 2, 3, 5])
    expect(res[2]).toBe(4)
    expect(res[4]).toEqual([3, 4])
    expect(res[5]).toEqual([2, 4, 6, 8])
  })

  test('defines an access objects', () => {
    const env = new Env()

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
