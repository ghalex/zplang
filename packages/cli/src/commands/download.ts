import { type Api } from '@/api'
import clc from 'cli-color'
import { Command } from 'commander'

const program = new Command('download')

export default (config: any, api: Api) => {
  program
    .description('Download data from zapant.com')
    .option('-s, --symbols <symbols>', 'comma separated list of symbols')
    .option('-w, --window <window>', 'window size')
    .option('-r, --resolution [resolution]', 'resolution', '1440' )
    .option('-e, --end [end]', 'end date', undefined)
    .action(async (opts) => {
      try {
        const { window, resolution } = opts
        const symbols = opts.symbols.split(',')
        const end = opts.end ? new Date(opts.end).toISOString() : undefined
        
        await api.data.download(symbols, window, resolution, end)
      } catch (e: any) {
        console.error(clc.red(`Error: ${e.message}`))
      }

    })

  return program
}