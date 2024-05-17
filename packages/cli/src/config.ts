import Configstore from 'configstore'
import os from 'node:os'

const homedir = os.homedir()
const currdir = process.cwd()

const loadConfig = async () => {
  try {
    const config = await import(currdir + '/zp.config.js')

    const mainConfig = {
      dataDir: "./example/data",
      apiUrl: "http://zapant.com/api",
      backtest: {
        analyzers: []
      },
      ...config.default
    }

    return mainConfig
  } catch (e) {
    console.error('Error loading config file. Please make sure you have a zp.config.js file in the root of your project.')
    return {
      dataDir: "./data",
      apiUrl: "http://zapant.com/api",
      backtest: {
        analyzers: []
      }
    }
  }
}


export default loadConfig