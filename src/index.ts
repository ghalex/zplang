import parser from './parser'
import analyzer from './analyzer'
import { Env } from './core'
import * as ex from './examples'

function createEnvirement () {
  const env = new Env()

  // Market
  env.bind('cmr', (symbol, window) => {
    const test = { AAPL: 1, MSFT: 0.2, SNOW: 0.6 }
    return test[symbol]
  })

  env.bind('orderUnits', (symbol, units) => {
    return { symbol, units, date: new Date() }
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

console.log('Result:')
console.dir(result, { depth: null })
const orders = result[result.length - 1].map(x => x[x.length - 1])
console.log(orders)
