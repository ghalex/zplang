import * as fs from 'node:fs'
import * as path from 'node:path'
import { gzipSync, gunzipSync } from 'node:zlib'
import clc from 'cli-color'
import Axios, { type AxiosInstance } from 'axios'
import ora from 'ora'
import dayjs from 'dayjs'

export default (config: any) => {
  
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

  const get = (symbol: string, window: number, resolution?: number, end?: string) => {
    const dataDir = config.get('dataDir')
    const date = end ? dayjs(end) : dayjs()

    const key = `${parseSymbol(symbol)}_${resolution ?? 1440}_${date.format('YYYYMMDD')}`
    const filePath = path.join(dataDir, key + '.data')

    if (!fs.existsSync(filePath)) {
      return []
    }

    try {
      const fileContents = fs.readFileSync(filePath);
      const buffer = gunzipSync(fileContents);

      const data = JSON.parse(buffer.toString('utf8'));

      if (data.length < window) {
          return [];
      }

      return data.slice(0, window);
    } catch (err: any) {
      throw new Error(`Error reading compressed data from ${filePath}: ${err.message}`)
    }
  }

  const save = async (symbol: string, resolution: number, end: string | null, data: any) => {
    const dataDir = config.get('dataDir')
    const date = end ? dayjs(end) : dayjs()

    const key = `${parseSymbol(symbol)}_${resolution ?? 1440}_${date.format('YYYYMMDD')}`
    const filePath = path.join(dataDir, key + '.data')
    const jsonString = JSON.stringify(data, null, 2)
    const buffer = Buffer.from(jsonString, 'utf8')

    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }

    try {
      const compressedBuffer = gzipSync(buffer)
      fs.writeFileSync(filePath, compressedBuffer)

      const size = compressedBuffer.length;
      const kiloBytes = size / 1024;
      console.log(`→ Data for ${clc.bold.green(symbol)} symbol was saved successfully ${clc.green(`(${kiloBytes.toFixed(2)} KB)`)}`);

      return filePath;
    } catch (err: any) {
        console.error(`Error writing compressed data to ${filePath}: ${err.message}`);
        throw err;
    }
  }

  const download = async (symbols: string[], window: number, resolution?: number, end?: string) => {
    const dataDir = config.get('dataDir')
    const spinner = ora(`Downloading data for [ ${clc.bold.green(symbols.join(', '))} ]`).start()
    try {

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
      spinner.fail()

      if (e.response) {
        if(e.response.status === 401) {
          throw new Error('You must be logged in to download data. Please run `zplang login` command.')
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