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

const resToString = (res: any, flags: any, json = false) => {
  if (flags.stdout) {
    return json ? { stdout: res.stdout } : '\n' + res.stdout
  } else {
    if (flags.last) {
      return json ? res.result[res.result.length - 1] : JSON.stringify(res.result[res.result.length - 1], null, 2)
    } else {
      return json ? res.result : JSON.stringify(res.result, null, 2)
    }
  }
}

export default class ExecuteCommand extends Command {
  static description = 'Execute a ".zp" file'
  static enableJsonFlag = true
  static examples = [
    '<%= config.bin %> <%= command.id %> --file hello.zp --data "./data"'
  ]

  static flags = {
    file: Flags.string({ char: 'f', required: true, description: 'file with code to execute' }),
    data: Flags.string({ char: 'd', description: 'data directory to load assests price', default: 'data' }),
    stdout: Flags.boolean({ char: 's' }),
    last: Flags.boolean({ char: 'l' })
  }

  async run (): Promise<any> {
    const { flags } = await this.parse(ExecuteCommand)
    const { dataDir } = loadConfig()
    const data = loadData(flags.data ?? dataDir)

    try {
      const code = readCode(flags.file)
      const res = runCode(code, data)

      if (flags.json) {
        return resToString(res, flags, true)
      } else {
        log.success('File "%s" executed with success', flags.file)
        log.result(resToString(res, flags))
      }
    } catch (err: any) {
      log.error('File "%s" executed with error', flags.file)
      log.error(err.message)

      return { error: err.message }
    }
  }
}
