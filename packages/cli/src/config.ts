import Configstore from 'configstore'
import os from 'node:os'

const homedir = os.homedir()
const currdir = process.cwd()
const storage = new Configstore('zplang', { 'accessToken': null, 'user': null }, { configPath: homedir + '/.zp/zpstorage.json' })
const config = require(currdir + '/zp.config.js')

const mainConfig = {
  dataDir: "./example/data",
  apiUrl: "http://zapant.com/api",
  backtest: {
    analyzers: []
  },
  ...config,
  storage
}


export default mainConfig