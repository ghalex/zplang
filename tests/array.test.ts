import zp, { Env } from '../src/lib'
// import * as fs from 'node:fs'

const code1 = String.raw`
  (def arr1 [1, 2, 3])
  (length arr1)
`

describe('array', () => {
  test('defines an array', () => {
    const env = new Env()
    const ast = zp.getAst(code1)
    const res = ast.map(stmt => stmt.eval(env))

    expect(res[0]).toEqual([1, 2, 3])
    expect(res[1]).toBe(3)
  })
})
