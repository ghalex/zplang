import * as fs from 'node:fs'
import * as path from 'node:path'
import * as signale from 'signale'
import {Command, Flags} from '@oclif/core'
import zp, { Env, modules } from 'zplang'

const log = new signale.Signale({ scope: 'zplang', types: {
  result: {
    badge: '=',
    label: 'result',
    color: 'cyan'
  }
}})
const interactive = new signale.Signale({interactive: true, scope: 'zplang'})

const readCode = (fileName: string) => {
  const fileContents = fs.readFileSync(fileName, 'utf8')
  return fileContents
}

const runCode = (code: string, bars: any) => {
  const start = performance.now()
  const zpEnv = new Env()

  zpEnv.loadBars(bars)
  zpEnv.loadModule(modules.core)
  zpEnv.loadModule(modules.assets)

  const result = zp.evalCode(zpEnv, code)
  const stop = performance.now()
  const inSeconds = (stop - start) / 1000

  return {
    result,
    time: inSeconds
  }
}

const loadData = (dataDir?: string) => {
  try {
    const files = fs.readdirSync(path.join(process.cwd(), dataDir ?? 'data'))

    const data = files.map((fileName) => {
      // const slug = fileName.replace('.json', '')
      const fullPath = path.join(process.cwd(), dataDir ?? 'data', fileName)
      const readFile = fs.readFileSync(fullPath, 'utf-8')
      

      return {
        ...JSON.parse(readFile)
      }
    })

    return data.reduce((p, c) => ({...p, ...c}), {})
  } catch (error) {
    console.error(error)
    return []
  }
}

export default class ExecuteCommand extends Command {
  static description = 'Execute a ".zp" file'

  static examples = [
    '<%= config.bin %>  <%= command.id %>',
  ]

  static flags = {
    file: Flags.string({char: 'f', required: true, description: 'file with code to execute'}),
    data: Flags.string({char: 'd', description: 'data directory to load assests price', default: 'data'})
  }

  async run(): Promise<void> {

    const {flags} = await this.parse(ExecuteCommand)
    const data = loadData(flags.data)
    
    interactive.await('[%d/2] - Executing file %', 1, flags.file);

    try {
      const code = readCode(flags.file)
      const res = runCode(code, data)

      setTimeout(() => {
        interactive.success('[%d/2] - File "%s" executed with success', 2, flags.file);
        log.result(JSON.stringify(res, null, 2))
      }, 500)
    } catch (err: any) {
      interactive.error('[%d/2] - File "%s" executed with error', 2, flags.file);
      log.error(err.message)
    }
  }
}