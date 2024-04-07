import * as fs from 'node:fs'
import * as path from 'node:path'
import clc from 'cli-color'
import zlib from 'zlib'
import Axios, { type AxiosInstance } from 'axios'
import ora from 'ora'

export default (config: any) => {
  const dataDir = path.join(process.cwd(), config.get('dataDir') ?? 'data')
  const axios: AxiosInstance = Axios.create({
    baseURL: config.get('apiUrl') ?? 'https://zapant.com/api',
    timeout: 80000,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  const parseSymbol = (symbol: string) => {
    return symbol.replace(/\//g, '_')
  }

  const get = (symbol: string, window: number, resolution?: number, end?: string): Promise<any[]> => {
    const key = `${parseSymbol(symbol)}_${resolution ?? 1440}_${end ?? 'last'}`
    const filePath = path.join(dataDir, key + '.data')

    if (!fs.existsSync(filePath)) {
      return Promise.resolve([])
    }

    const fileContents = fs.readFileSync(filePath)

    return new Promise((resolve, reject) => {
      zlib.gunzip(fileContents, (err, buffer) => {
          if (err) {
            reject(err)
            return
          }

          const data = JSON.parse(buffer.toString('utf8'))

          if (data.length < window) {
            return resolve([])
          }

          return resolve(data.slice(0, window))
      })
    })
  }

  const save = async (symbol: string, resolution: number, end: string | null, data: any) => {
    const key = `${parseSymbol(symbol)}_${resolution ?? 1440}_${end ?? 'last'}`
    const filePath = path.join(dataDir, key + '.data')
    const jsonString = JSON.stringify(data, null, 2)
    const buffer = Buffer.from(jsonString, 'utf8')

    return new Promise((resolve, reject) => {
      zlib.gzip(buffer, (err, compressedBuffer) => {
        if (err) {
            console.error(`Error compressing data: ${err.message}`);
            reject(err)
            return;
        }

        // Write the compressed data to the file
        fs.writeFile(filePath, compressedBuffer, (err) => {
          if (err) {
              console.error(`Error writing compressed data to ${filePath}: ${err.message}`);
              reject(err)
          }
          
          const size = compressedBuffer.length
          const kiloBytes = size / 1024

          console.log(`- Data for ${clc.bold.green(symbol)} symbol was saved successfully ${clc.green(`(${kiloBytes.toFixed(2)} KB)`)}`)
          resolve(compressedBuffer)
        })
      })
    })
  }

  const download = async (symbols: string[], window: number, resolution?: number, end?: string) => {
    try {
      const spinner = ora(`Downloading data for [ ${clc.bold.green(symbols.join(', '))} ]`).start()

      const { data } = await axios.get('/bars', {
        params: {
          symbols: symbols.join(','),
          window,
          resolution: resolution ?? 1440,
          end: end
        },
        headers: {
          Authorization: `Bearer ${config.get('accessToken')}`
        }
      })

      spinner.succeed()
      console.log(`${clc.green('✔ Success:')} Data was downloaded successfully`)

      for (const symbol of symbols) {
        if (data[symbol] && data[symbol].length > 0) {
          await save(symbol, resolution ?? 1440, end ?? null, data[symbol])
        }
      }

      console.log(`${clc.green('✔ Success:')} All data was saved successfully in ${clc.underline.bold(dataDir)} directory`)
      
      return data

    } catch (e: any) {
      if (e.response) {
        if(e.response.status === 401) {
          throw new Error('Unauthorized')
        }

        throw new Error(e.response.data.message)
      } else if (e.request) {
        throw new Error('Request error')
      } else {
        throw new Error(e.message)
      }
    }

  }

  return { get, save, download }
}