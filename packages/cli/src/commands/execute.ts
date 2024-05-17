import clc from 'cli-color'
import { Command } from 'commander'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { Env } from 'zplang'
import loadConfig from '../config'
import * as api from '../api'

const program = new Command('execute')

export default () => {
  program
    .usage('<file> [options]')
    .description('execute a zplang file and display the orders generated by the code')
    .argument('file', 'file to execute')
    .option('-d, --date <date>', 'date to execute the file')
    .option('-o, --orders <orders>', 'orders output file')
    .option('-r, --result <result>', 'result output file')
    .action(async (file, opts) => {

      try {
        console.log(clc.cyanBright(`→ Executing file: `) + clc.underline(file) + '\n')

        const config = await loadConfig()
        const code = api.code().readCode(file)
        const requirements = api.code().getSymbols(code, [])

        const bars = await api.data(config).downloadBars(requirements.symbols, requirements.maxWindow, requirements?.settings?.timeframe ?? 1440, opts.date)

        const env = new Env({ bars })
        env.bind('barIndex', 1)

        const result = api.code().runCode(code, env)

        console.log(`${clc.green('✔ Success:')} Code was executed successfully`)
        console.log(`${clc.green('✔ Execution time:')} ${clc.bold(result.time.toFixed(2))} seconds\n`)

        if (opts.orders) {
          const filePath = path.join(process.cwd(), opts.orders)
          console.log(clc.cyanBright(`→ Saving orders to file: `) + clc.underline(filePath))

          fs.writeFileSync(filePath, JSON.stringify(result.orders, null, 2))
          console.log(`${clc.green('✔ Success:')} Orders saved successfully\n`)
        }

        if (opts.result) {
          const filePath = path.join(process.cwd(), opts.result)
          console.log(clc.cyanBright(`→ Saving result to file: `) + clc.underline(filePath))

          fs.writeFileSync(filePath, JSON.stringify(result, null, 2))
          console.log(`${clc.green('✔ Success:')} Result saved successfully\n`)
        }
        
        if (result.stdout) {
          console.log(clc.cyanBright(`→ Output: `))
          console.log(result.stdout.split('\n').map(l => clc.xterm(8) (l)).join('\n'))
        }

      } catch (e: any) {
        console.error(clc.red(`Error: ${e.message}`))
      }

    })

  return program
}