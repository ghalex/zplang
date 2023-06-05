import parser from './parser'
import analyzer from './analyzer'
import { Env } from './core'
import figlet from 'figlet'
import * as readline from 'node:readline'
// import * as ex from './examples'
import { stdin as input, stdout as output } from 'node:process'
import { type MatchResult } from 'ohm-js'

const rl = readline.createInterface({ input, output, terminal: false })

// process.stdin.on('keypress', function (s, key) {
//   console.log('sssss')
//   readline.cursorTo(output, 0, 0)
//   if (key.name === 'up') {
//   }
// })

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

// const m = parser.parse(ex.array)
// const semantics = analyzer.createSemantics(parser.getGrammar(), m)
// const adapter = semantics(m)
// const ast = adapter.ast() as any[]

// console.log('\nTree:')
// console.dir(ast, { depth: null, colors: true })

// console.log('\nCode:')
// console.log(ast.join('\n'))
// console.log('\n')

// const env = createEnvirement()

// console.log('---------------------')
// const result = ast.map(s => s.eval?.(env))
// console.log('---------------------')

// console.log('Result:')
// console.dir(result, { depth: null })
// const orders = result[result.length - 1].map(x => x[x.length - 1])
// console.log(orders)

const evalZp = (env: Env, m: MatchResult) => {
  const semantics = analyzer.createSemantics(parser.getGrammar(), m)
  const adapter = semantics(m)
  const ast = adapter.ast() as any[]

  return ast.map(s => s.eval?.(env))
}

const clear = (ascii) => {
  readline.cursorTo(output, 0, 0)
  readline.clearScreenDown(process.stdout)
  console.log(ascii)
  console.log('v0.1.2')
  console.log('release-05/Jun/2023')
  console.log(`
help:
 - "examples" to see some examples
 - "exit" to close the CLI
`)
}

figlet('Zaplang', {
  // font: 'Ghost',
  horizontalLayout: 'default',
  verticalLayout: 'default',
  width: 80,
  whitespaceBreak: true
}, async (err, ascii) => {
  if (err) {
    console.log(err)
  }

  const g = parser.getGrammar()
  const m = g.matcher()

  const env = createEnvirement()

  rl.setPrompt('#user> ')
  clear(ascii)

  rl.prompt()
  rl.on('line', (line) => {
    switch (line.trim()) {
      case 'exit':
        rl.close()
        break
      case 'examples':
        console.log(`
(def age: 22)             ;; defines a variable
(def arr1: [1, 2, 3])     ;; defines an array

(print: age)              ;; prints a var

(def myFn: (fn [param1]: (print: param1)))
(myFn: "Alex")
`)
        break

      case 'cls':
        clear(ascii)
        break
      default: {
        if (line.length > 0) {
          m.setInput(line)
          try {
            const match = m.match()

            if (match.succeeded()) {
              const res = evalZp(env, match)
              console.log(res[0])
            } else {
              console.log(match.message)
            }
          } catch (e: any) {
            console.log(e.message)
          }
        }

        break
      }
    }
    rl.prompt()
  })
    .on('close', () => {
      console.log('Have a great day!')
      process.exit(0)
    })
  // await whileReadLine()
})
