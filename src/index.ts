import parser from './parser'
import analyzer from './analyzer'
import { Env } from './core'

function createEnvirement () {
  const env = new Env()

  env.bind('+', (...args) => args.reduce((prev, curr) => prev + curr, 0))
  env.bind('-', (...args) => args.slice(1).reduce((prev, curr) => prev - curr, args[0]))
  env.bind('*', (...args) => args.slice(1).reduce((prev, curr) => prev * curr, args[0]))
  env.bind('/', (...args) => args.slice(1).reduce((prev, curr) => prev / curr, args[0]))
  env.bind('str', (...args) => args.join(' '))
  env.bind('nth', (idx, arr) => {
    if (idx < 0) {
      return arr[arr.length + idx % arr.length]
    }

    return arr[idx % arr.length]
  })

  env.bind('print', (...args) => {
    console.log('#user> ', ...args)
    return args.join(' ')
  })

  env.bind('price', (tick) => {
    const data = {
      AAPL: [{ close: 122, date: '01/01/2023' }, { close: 124, date: '02/01/2023' }]
    }

    if (!data[tick]) {
      console.log('#user>', `Price for "${tick}" not found`)
    }

    return data[tick]
  })

  return env
}

const sourceCode1 = String.raw`
  (def age: 37)
  (def age2: age - 7)
  (def fname: "Alex")
  (def lname: "Ghiura")
  (def name: fname + " " + lname)

  (print: age)
  (print: "name: " name)

  (price: "AAPL")
`

const sourceCode2 = String.raw`
  (def arr1: [1 2 3 4])   // define arr1 as array
  (print: arr1)

  (def msg: (str: "Last element" "is" (nth: -1 arr1)))
  (print: msg)
`

const sourceCode3 = String.raw`
  (def arr1: [1 2 3 4])
  (def first:
    (fn [arr]:
      (nth: 0 arr)
    )
  )

  (def last:
    (fn [arr]:
      (def age: 2)      // Multiple lines example
      (nth: -1 arr)
    )
  )

  (print: (first: arr1))
  (print: (last: arr1))
`

const m = parser.parse(sourceCode2)
const semantics = analyzer.createSemantics(parser.getGrammar(), m)
const adapter = semantics(m)
const ast = adapter.ast() as any[]

console.log('\nTree:')
console.dir(ast, { depth: null, colors: true })

console.log('\nCode:')
console.log(ast.join('\n'))
console.log('\n')

const env = createEnvirement()

console.log('---------------------')
const result = ast.map(s => s.eval?.(env))
console.log('---------------------')

console.log(env)
