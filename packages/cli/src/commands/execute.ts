import * as signale from 'signale'
import { Command, Flags } from '@oclif/core'
import { loadConfig, loadData, readCode, runCode } from '../helpers'

const log = new signale.Signale({
  scope: 'zplang',
  types: {
    result: {
      badge: '=',
      label: 'result',
      color: 'cyan'
    }
  }
})

export default class ExecuteCommand extends Command {
  static description = 'Execute a ".zp" file'
  static enableJsonFlag = true
  static examples = [
    '<%= config.bin %> <%= command.id %> --file hello.zp --data "./data"'
  ]

  static flags = {
    file: Flags.string({ char: 'f', required: true, description: 'file with code to execute' }),
    data: Flags.string({ char: 'd', description: 'data directory to load assests price', default: 'data' })
  }

  async run (): Promise<any> {
    const { flags } = await this.parse(ExecuteCommand)
    const { dataDir } = loadConfig()
    const data = loadData(flags.data ?? dataDir)

    try {
      const code = readCode(flags.file)
      const res = runCode(code, data)

      if (flags.json) {
        return res
      } else {
        log.success('File "%s" executed with success', flags.file)
        log.result(JSON.stringify(res, null, 2))
      }
    } catch (err: any) {
      log.error('File "%s" executed with error', flags.file)
      log.error(err.message)

      return { error: err.message }
    }
  }
}
