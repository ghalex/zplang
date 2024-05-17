import * as fs from 'node:fs'
import * as path from 'node:path'
import { gzipSync, gunzipSync } from 'node:zlib'
import clc from 'cli-color'
import dayjs from 'dayjs'

export default (config) => {
  
  /**
   * Parse symbol
   * @param symbol 
   * @returns 
   */
  const parseSymbol = (symbol: string) => {
    return symbol.replace(/\//g, '_')
  }
  
  /**
   * Get from cache
   * @param symbol 
   * @param window 
   * @param resolution 
   * @param end 
   * @returns 
   */
  const get = (symbol: string, window: number, resolution?: number, end?: string) => {
    const dataDir = config.dataDir
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
  
  /**
   * Save to cache
   * @param symbol 
   * @param resolution 
   * @param end 
   * @param data 
   * @returns 
   */
  const save = async (symbol: string, resolution: number, end: string | null, data: any) => {
    const dataDir = config.dataDir
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

  return { get, save }
}