import zp from 'zplang'
import { Env } from 'zplang'
import { uniq } from 'ramda'
import * as fs from 'node:fs'
import * as path from 'node:path'

export default (config: any) => {
  const runCode = (code: string, bars: any) => {
    const start = performance.now()
    const zpEnv = new Env({ bars })

    zpEnv.loadModuleByName('core/indicators')
    zpEnv.loadModuleByName('core/trading')

    const result = zp.evalCode(zpEnv, code)
    const stop = performance.now()
    const inSeconds = (stop - start) / 1000

    return {
      portfolio: zpEnv.get('getPortfolio')(),
      result,
      stdout: zpEnv.stdout,
      time: inSeconds
    }
  }

  const getSymbols = (code: string, openPositions: any = []) => {
    const metaEnv = new Env({ isMeta: true })

    metaEnv.loadModuleByName('core/indicators')
    metaEnv.loadModuleByName('core/trading')

    // Init portfolio
    metaEnv.get('changePortfolio')({
      openPositions
    })

    zp.evalCode(metaEnv, code)

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