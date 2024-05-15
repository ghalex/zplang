import * as path from 'node:path'
import * as fs from 'node:fs'
import { type Api } from '@/api'
import clc from 'cli-color'
import { Command } from 'commander'
import { init, map } from 'ramda'
import dayjs from 'dayjs'
import { Env } from 'zplang'
import { floor } from '../utils'
import Strategy from '@/backtest/strategy'

const program = new Command('backtest')

class LoggerAnalyzer {
  name: string = 'logger'

  next ({ strategy, date, barIndex, bars, orders }) {
    console.log(`Date: ${date}, BarIndex: ${barIndex}`)
    console.log(`Cash: ${strategy.broker.getCash()}`)
    console.log(`Bars:`)
    console.dir(bars, { depth: null, colors: true })
    // console.log(strategy.broker.getOpenPositions())
  }
}

class RetursAnalyzer {
  name: string = 'returns'
  returns: any = {}

  next ({ strategy, date, barIndex, bars, orders }) {
    this.returns[date] = strategy.broker.getValue()
  }
}

export default (config: any, api: Api) => {

  program
    .usage('<file> [options]')
    .description('run a backtest using a zplang file and display the result')
    .argument('file', 'strategy to backtest')
    .option('-d, --end <date>', 'backtest end date')
    .option('-w, --window <window>', 'bars to load for backtest')
    .option('-r, --result <result>', 'result output file')
    .action(async (file, opts) => {

      try {
        console.log(clc.cyanBright(`→ Backtesting using file: `) + clc.underline(file) + '\n')

        // 1. Download bars
        const code = api.code.readCode(file)
        const strategy = new Strategy({ code })


        //strategy.addAnalyzer(new LoggerAnalyzer())
        strategy.addAnalyzer(new RetursAnalyzer())

        const { symbols, maxWindow, settings } = api.code.getSymbols(code, [])
        const bars: Record<string, any[]> = await api.data.downloadBars(symbols, maxWindow + parseInt(opts.window), settings.timeframe ?? 1440, opts.end)

        // 2. Run backtest
        const allDatas: any[] = Object.values(bars)
        const dates = allDatas[0].map(x => dayjs(x.date).format('YYYY-MM-DD')).slice(0, parseInt(opts.window)).reverse()

        strategy.start()

        for (let index = 0; index < dates.length; index++) {
          const date = dates[index];
          const barIndex = index + 1
          const currentBars = map(arr => arr.concat().reverse().slice(0, index + maxWindow + 1).reverse(), bars)
          const context = { bars: currentBars, code, date, barIndex }

          strategy.prenext(context)
          strategy.next(context)

        }

        // 3. Finalize backtest
        strategy.end()

        // console.log(`${clc.green('✔ Success:')} Code was executed successfully`)
        // console.log(`${clc.green('✔ Execution time:')} ${clc.bold(result.time.toFixed(2))} seconds\n`)

        const result = {
          startCash: strategy.broker.getCashStart(),
          endCash: strategy.broker.getCash(),
          totalPl: strategy.broker.getPL(),
          totalPlPct: floor(strategy.broker.getPL() / strategy.broker.getCashStart(), 4),
          positions: strategy.broker.getPositions()
        }

        console.log(result)
        console.log(strategy.getAnalyzer('returns').returns)

        if (opts.result) {
          const filePath = path.join(process.cwd(), opts.result)
          console.log(clc.cyanBright(`→ Saving result to file: `) + clc.underline(filePath))

          fs.writeFileSync(filePath, JSON.stringify(result, null, 2))
          console.log(`${clc.green('✔ Success:')} Result saved successfully\n`)
        }
        
        // if (result.stdout) {
        //   console.log(clc.cyanBright(`→ Output: `))
        //   console.log(result.stdout.split('\n').map(l => clc.xterm(8) (l)).join('\n'))
        // }
        // console.dir(portfolio.orders, { depth: null, colors: true })
        

      } catch (e: any) {
        console.error(clc.red(`Error: ${e.message}`))
      }

    })

  return program
}