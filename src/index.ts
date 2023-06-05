import parser from './parser'
import analyzer from './analyzer'
import { Env } from './core'
import * as ex from './examples'
import Lambda from './core/Lambda'

function createEnvirement () {
  const env = new Env()

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

const m = parser.parse(ex.array)
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

// console.log('Result:')
// console.log(result)
