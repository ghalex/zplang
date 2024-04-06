import { type Api } from '@/api'
import clc from 'cli-color'
import { Command } from 'commander'

const program = new Command('execute')

export default (config: any, api: Api) => {
  

  program
    .description('Execute a zplang file and display the output')
    .option('-f, --file <name>', 'file to execute')
    .option('-d, --data <dir>', 'data directory')
    .action(async (opts) => {

      const data = await api.data.get('AAPL', 2)
      console.log(data)

      try {
        const { file } = opts
        console.log(clc.cyanBright(`Running file: `) + file)

        const code = api.code.readCode(file)
        const xxx = api.code.getSymbols(code, [])

        console.log(xxx)
      } catch (e: any) {
        console.error(clc.red(`Error: ${e.message}`))
      }

    })

  return program
}