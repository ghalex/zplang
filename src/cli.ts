import zp, { Env, modules } from './lib'
import figlet from 'figlet'
import * as readline from 'node:readline'
import * as r from 'ramda'
import { stdin as input, stdout as output } from 'node:process'

import data from './data'

const rl = readline.createInterface({ input, output, terminal: false })

function createEnvirement () {
  const env = new Env()

  env.loadBars(data)
  env.loadModule(modules.core)
  env.loadModule(modules.assets)

  // Market
  env.bind('cmr', (asset, qty) => {
    console.log(asset, qty)
    return 2
  })

  env.bind('sma', (prices) => {
    if (typeof prices[0] === 'object') {
      return r.mean(r.pluck('close')(prices))
    }

    return r.mean(prices)
  })

  env.bind('orderUnits', (symbol, units) => {
    return { symbol, units, date: new Date() }
  })

  return env
}

const clear = (ascii) => {
  const assets = Object.keys(data)
  // const assetsDate = data[assets[0]]?.[0].dateFormatted

  readline.cursorTo(output, 0, 0)
  readline.clearScreenDown(process.stdout)
  console.log(ascii)
  console.log('v0.1.2')
  console.log('release-05/Jun/2023')
  console.log('assets: ' + assets.join(', '))
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

  const m = zp.getMatcher()
  const zpEnv = createEnvirement()

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
(:close {AAPL})           ;; prints AAPL close price

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
              const res = zp.evalMatch(zpEnv, match)
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
