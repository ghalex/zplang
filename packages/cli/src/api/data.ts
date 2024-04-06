import * as fs from 'node:fs'
import * as path from 'node:path'
import zlib from 'zlib'
import Axios, { type AxiosInstance } from 'axios'

export default (config: any) => {
  const dataDir = path.join(process.cwd(), config.get('dataDir') ?? 'data')
  const axios: AxiosInstance = Axios.create({
    baseURL: config.get('apiUrl') ?? 'https://zapant.com/api',
    timeout: 80000,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  const get = (symbol: string, window: number, resolution?: number, end?: string): Promise<any[]> => {
    const key = `${symbol}_${resolution ?? 1440}_${end ?? 'last'}`
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

  const save = (symbol: string, resolution: number, end: string | null, data: any) => {
    const key = `${symbol}_${resolution ?? 1440}_${end ?? 'last'}`
    const filePath = path.join(dataDir, key + '.data')
    const jsonString = JSON.stringify(data, null, 2)
    const buffer = Buffer.from(jsonString, 'utf8')

    // Compress the data
    zlib.gzip(buffer, (err, compressedBuffer) => {
      if (err) {
          console.error(`Error compressing data: ${err.message}`);
          return;
      }

      // Write the compressed data to the file
      fs.writeFile(filePath, compressedBuffer, (err) => {
        if (err) {
            console.error(`Error writing compressed data to ${filePath}: ${err.message}`);
        }
      })
    })
  }

  const download = async (symbols: string[], window: number, resolution?: number, end?: string) => {
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

      for (const symbol of symbols) {
        save(symbol, resolution ?? 1440, end ?? null, data[symbol])
      } 
    } catch (e: any) {
      if(e.response.status === 401) {
        throw new Error('Unauthorized')
      }

      throw new Error(e.response.data.message)
    }

  }

  return { get, save, download }
}