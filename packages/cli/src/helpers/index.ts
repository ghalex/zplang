import * as fs from 'node:fs'
import * as path from 'node:path'
import zp, { Env } from 'zplang'

export const readCode = (fileName: string) => {
  const fileContents = fs.readFileSync(fileName, 'utf8')
  return fileContents
}

export const runCode = (code: string, bars: any) => {
  const start = performance.now()
  const zpEnv = new Env()

  zpEnv.loadBars(bars)

  const result = zp.evalCode(zpEnv, code)
  const stop = performance.now()
  const inSeconds = (stop - start) / 1000

  return {
    result,
    time: inSeconds
  }
}

export const loadData = (dataDir?: string) => {
  if (!fs.existsSync(path.join(process.cwd(), dataDir ?? 'data'))) { return {} }

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

    return data.reduce((p, c) => ({ ...p, ...c }), {})
  } catch (error) {
    console.error(error)
    return []
  }
}

export const loadConfig = () => {
  if (!fs.existsSync(path.join(process.cwd(), 'zpconfig.json'))) { return {} }

  try {
    const config = fs.readFileSync(path.join(process.cwd(), 'zpconfig.json'), 'utf-8')
    return JSON.parse(config)
  } catch {
    return {}
  }
}
