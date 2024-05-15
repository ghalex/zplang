import { Env, evalCode } from 'zplang'
import { uniq } from 'ramda'
import * as fs from 'node:fs'
import * as path from 'node:path'

export default (config: any) => {
  const runCode = (code: string, zpEnv: Env) => {
    const start = performance.now()

    const result = evalCode(zpEnv, code)
    const stop = performance.now()
    const inSeconds = (stop - start) / 1000

    return {
      orders: zpEnv.call('getOrders'),
      result,
      stdout: zpEnv.stdout,
      time: inSeconds
    }
  }

  const getSymbols = (code: string, openPositions: any = []) => {
    const metaEnv = new Env({ isMeta: true })

    // Set positions
    metaEnv.call('setPositions', [openPositions])

    evalCode(metaEnv, code)

    const settings = metaEnv.getPragma()
    const allOpenPositions = [...openPositions, ...(settings.openPositions ?? [])] as any
    const assets: Record<string, number> = metaEnv.getAssets()
    const maxAssets = [...Object.values(assets)]
    const symbols = uniq([...Object.keys(assets), ...allOpenPositions.map(p => p.symbol)])
    const maxWindow = maxAssets.length > 0 ? Math.max(...maxAssets) : 1

    return { symbols, maxWindow, settings }
  }

  const readCode = (fileName: string) => {
    const filePath = path.join(process.cwd(), fileName)

    if (!fs.existsSync(filePath)) {
        throw new Error(`File "${fileName}" does not exist`)
    }

    return fs.readFileSync(filePath, 'utf8')
  }

  return { runCode, getSymbols, readCode }
}