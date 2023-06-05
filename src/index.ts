import parser from './parser'
import analyzer from './analyzer'
import { Env } from './core'
import { ex4 } from './examples'

function createEnvirement () {
  const env = new Env()

  env.bind('+', (...args) => args.reduce((prev, curr) => prev + curr, 0))
  env.bind('-', (...args) => args.slice(1).reduce((prev, curr) => prev - curr, args[0]))
  env.bind('*', (...args) => args.slice(1).reduce((prev, curr) => prev * curr, args[0]))
  env.bind('/', (...args) => args.slice(1).reduce((prev, curr) => prev / curr, args[0]))

  // String
  env.bind('str', (...args) => args.join(' '))
  env.bind('print', (...args) => {
    console.log('#user> ', ...args)
    return args.join(' ')
  })

  // Array
  env.bind('length', arr => arr.length)
  env.bind('nth', (idx, arr) => {
    if (idx < 0) {
      return arr[arr.length + idx % arr.length]
    }

    return arr[idx % arr.length]
  })

  

  // Market
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

const m = parser.parse(ex4)
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

console.log("Result:")
console.log(result)
