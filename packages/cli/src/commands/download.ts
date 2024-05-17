import clc from 'cli-color'
import { Command } from 'commander'
import { data } from '../api'
import loadConfig from '../config'

const program = new Command('download')

export default () => {
  program
    .description('download data from zapant.com')
    .option('-s, --symbols <symbols>', 'comma separated list of symbols')
    .option('-w, --window <window>', 'window size')
    .option('-r, --resolution [resolution]', 'resolution', '1440' )
    .option('-e, --end [end]', 'end date', undefined)
    .action(async (opts) => {
      try {
        const config = await loadConfig()
        const { window, resolution } = opts
        const symbols = opts.symbols.split(',')
        const end = opts.end ? new Date(opts.end).toISOString() : undefined
        
        await data(config).download(symbols, window, resolution, end)
      } catch (e: any) {
        console.error(clc.red(`Error: ${e.message}`))
        return process.exit(0)
      }

    })

  return program
}