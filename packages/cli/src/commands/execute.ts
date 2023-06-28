import * as signale from 'signale'
import { Command, Flags } from '@oclif/core'
import { loadData, readCode, runCode } from '../helpers'

const interactive = new signale.Signale({ interactive: true, scope: 'zplang' })
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

  static examples = [
    '<%= config.bin %> <%= command.id %>'
  ]

  static flags = {
    file: Flags.string({ char: 'f', required: true, description: 'file with code to execute' }),
    data: Flags.string({ char: 'd', description: 'data directory to load assests price', default: 'data' })
  }

  async run (): Promise<void> {
    const { flags } = await this.parse(ExecuteCommand)
    const data = loadData(flags.data)

    interactive.await('[%d/2] - Executing file %', 1, flags.file)

    try {
      const code = readCode(flags.file)
      const res = runCode(code, data)

      setTimeout(() => {
        interactive.success('[%d/2] - File "%s" executed with success', 2, flags.file)
        log.result(JSON.stringify(res, null, 2))
      }, 500)
    } catch (err: any) {
      interactive.error('[%d/2] - File "%s" executed with error', 2, flags.file)
      log.error(err.message)
    }
  }
}
