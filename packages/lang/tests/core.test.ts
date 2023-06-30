import zp, { Env, Lambda } from '../src/lib'

const codeToStr = (code: string) => {
  return code.split('\n').map(v => v.replace(/\s{2}/g, '')).filter(s => s.length > 0).join(',')
}

describe('core', () => {
  test('defines new variables', () => {
    const env = new Env()
    const code = String.raw`
      (def age 1)
      (def name "Alex")
      age
      name
    `

    const ast = zp.getAst(code)
    const res = ast.map(stmt => stmt.eval(env))

    console.log(res)

    expect(res[0]).toBe(1)
    expect(res[1]).toBe('Alex')
    expect(res[2]).toBe(1)
    expect(res[3]).toBe('Alex')
    expect(ast.toString()).toEqual(codeToStr(code))
  })

  test('arithmetic operators', () => {
    const env = new Env()

    const code = String.raw`
      (+ 2 (* 3 2))
      (def var1 (* 4 3))
      (def isBigger (> 10 5))
      (% 6 5)
    `
    const ast = zp.getAst(code)
    const res = ast.map(stmt => stmt.eval(env))

    expect(res[0]).toBe(8)
    expect(res[1]).toBe(12)
    expect(res[2]).toBe(true)
    expect(res[3]).toBe(1)
    expect(ast.toString()).toEqual(codeToStr(code))
  })

  test('function calls', () => {
    const env = new Env()

    const ast = zp.getAst(`
      (+ 2 3)
      (str "Alex" "Ghiura")
    `)
    const res = ast.map(stmt => stmt.eval(env))

    expect(res[0]).toBe(5)
    expect(res[1]).toBe('Alex Ghiura')
  })

  test('function definitions', () => {
    const env = new Env()

    const code = `
      (def myFn (fn [p1] p1))
      (myFn 2)
      (myFn "John")

      (defn mul [a, b] (* a b))
      (mul 2 3)
    `
    const ast = zp.getAst(code)
    const res = ast.map(stmt => stmt.eval(env))

    expect(res[0]).toBeInstanceOf(Lambda)
    expect(res[1]).toBe(2)
    expect(res[2]).toBe('John')

    expect(res[3]).toBeInstanceOf(Lambda)
    expect(res[4]).toBe(6)
    // expect(ast.toString()).toEqual(codeToStr(code))
  })

  test('curry functions', () => {
    const env = new Env()

    const code = `
      (def add [a, b] => (+ a b))
      (add 3 4)
    `
    const res = zp.evalCode(env, code)

    expect(res[1]).toEqual(7)
    // expect(ast.toString()).toEqual(codeToStr(code))
  })
})
