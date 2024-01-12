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
      (def arr1 ["Alex", "John"])
      (def name2 (first arr1))
    `

    const ast = zp.getAst(code)
    const res = ast.map(stmt => stmt.eval(env))

    expect(res[0]).toBe(1)
    expect(res[1]).toBe('Alex')
    expect(res[2]).toBe(1)
    expect(res[3]).toBe('Alex')
    expect(ast.toString()).toEqual(codeToStr(code))

    console.log(res)
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

  test('collections', () => {
    const env = new Env()

    const code = String.raw`
      (+ 2 3)
      (+ [2, 3, 4] [1, 1, 1] [2, 2, 2])
      (- [2, 3, 4] [1, 1, 1])
      (/ [2, 3, 4] [2, 2, 2])
      (= [1, 2] [1, 2])
    `
    const res = zp.evalCode(env, code)

    expect(res[0]).toEqual(5)
    expect(res[1]).toEqual([5, 6, 7])
    expect(res[2]).toEqual([1, 2, 3])
  })

  test('pragma', () => {
    const env = new Env({ isMeta: true })
    const code = String.raw`
      #pragma version "^0.1.0"
      #pragma test 1
      #pragma start "2020-01-01"
      #pragma end "2020-01-02"
      #pragma assets { AMD: 5, AAPL: 10 }
    `

    zp.evalCode(env, code)
    const settings = env.getPragma()

    expect(settings.test).toBe(1)
    expect(Object.keys(settings.assets)).toEqual(['AMD', 'AAPL'])

    // console.dir(res)
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

  test('let and do keyword', () => {
    const env = new Env()

    const code = `
      (def a 10)
      (let [a 3, b 4]
        (* 2 b)
        (+ a b)
      )

      (do
        (print "Hello")
        "World"
      )
    `
    const res = zp.evalCode(env, code)
    expect(res[1][1]).toEqual(7)

    console.log(res)
  })

})
