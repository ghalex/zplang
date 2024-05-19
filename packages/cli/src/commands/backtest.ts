import * as path from 'node:path'
import * as fs from 'node:fs'
import clc from 'cli-color'
import { Command } from 'commander'
import { init, map } from 'ramda'
import dayjs from 'dayjs'
import voca from 'voca'
import { Strategy } from 'zptrade-backtest'
import loadConfig from '../config'
import * as api from '../api'

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

export default () => {
  program
    .usage('<file> [options]')
    .description('run a backtest using a .zp or .js file and display the result')
    .argument('file', 'strategy to backtest')
    .option('-d, --date <date>', 'backtest end date')
    .option('-w, --window <window>', 'bars to load for backtest')
    .option('-r, --result <result>', 'result output file')
    .action(async (file, opts) => {

      try {
        const config = await loadConfig()
        const extension = path.extname(file)
        const lang = extension === '.js' ? 'js' : 'zp'

        console.log(clc.cyanBright(`→ Backtesting using file: `) + clc.underline(file) + '\n')

        // add defaults
        opts.window = opts.window ?? config.backtest?.window ?? 5
        opts.date = opts.date ?? config.backtest?.date ?? dayjs().format('YYYY-MM-DD')

        // 1. Download bars
        const code = api.code().readCode(file)
        const strategy = new Strategy({ code, lang })

        //strategy.addAnalyzer(new LoggerAnalyzer())
        strategy.addAnalyzers(config.backtest?.analyzers ?? [])

        const { symbols, maxWindow, settings } = api.code().getSymbols(code, lang, [])
        const bars: Record<string, any[]> = await api.data(config).downloadBars(symbols, maxWindow + parseInt(opts.window), settings.timeframe ?? 1440, opts.date)

        // 2. Run backtest
        const allDatas: any[] = Object.values(bars)
        
        if (allDatas.length === 0) {
          throw new Error('No data in automation for backtest')
        }

        const dates = allDatas[0].map(x => dayjs(x.date).format('YYYY-MM-DD')).slice(0, parseInt(opts.window)).reverse()

        strategy.start()

        for (let index = 0; index < dates.length; index++) {
          const date = dates[index];
          const barIndex = index + 1
          const currentBars = map(arr => arr.concat().reverse().slice(0, index + maxWindow + 1).reverse(), bars)
          const context = { code, date, barIndex }

          strategy.setBarIndex(barIndex)
          strategy.setBars(currentBars)
          strategy.prenext(context)
          strategy.next(context)

        }

        // 3. Finalize backtest
        strategy.end()

        console.log('')
        console.log(`${clc.green('✔ Success:')} Backtest was executed successfully`)
        console.log(`${clc.green('✔ Execution time:')} ${clc.bold(strategy.duration.toFixed(2))} seconds\n`)

        const result: any = {
          startCash: strategy.broker.getCashStart(),
          endCash: strategy.broker.getCash(),
          pl: strategy.broker.getPL(),
        }

        console.log(clc.cyanBright(`→ Result: `))
        console.dir(result, { depth: null, colors: true })
        console.log('')

        result.analyzers = {}

        for (const analyzer of strategy.analyzers) {
          result.analyzers[analyzer.name] = analyzer.data
          console.log(clc.cyanBright(`→ Analyzer: `) + clc.underline(voca.capitalize(analyzer.name)))
          console.dir(analyzer.data, { depth: null, colors: true })
          console.log('')
        }

        if (opts.result) {
          const filePath = path.join(process.cwd(), opts.result)
          console.log(clc.cyanBright(`→ Saving result to file: `) + clc.underline(filePath))

          fs.writeFileSync(filePath, JSON.stringify(result, null, 2))
          console.log(`${clc.green('✔ Success:')} Result saved successfully\n`)
        }

        

      } catch (e: any) {
        console.error(clc.red(`Error: ${e.message}`))
      }

    })

  return program
}