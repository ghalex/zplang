#!/usr/bin/env node
import figlet from 'figlet'

import os from 'node:os'
import { Command } from 'commander'
import createApi from './api'
import create from './commands/create'
import executeCommand from './commands/execute'
import login from './commands/login'
import download from './commands/download'
import backtest from './commands/backtest'

import Configstore from 'configstore'
import { exit } from 'node:process'

figlet("zplang-cli", (err, data) => {
  const homedir = os.homedir()
  const currdir = process.cwd()

  const logoText = err ? 'zplang CLI' : data + '\n'
  const localConfig = new Configstore('zplang', {}, { configPath: currdir + '/zpconfig.json' })
  const config = new Configstore('zplang', { 'dataDir':  homedir + '/.zp/data', 'apiUrl': 'https://zapant.com/api' }, { configPath: homedir + '/.zp/zpconfig.json' })

  config.set(localConfig.all)

  const api = createApi(config)

  const program = new Command()

  program
    .name('zplang')
    .version('1.0.6')
    .usage("command [options]")
    .addHelpText('beforeAll', logoText)

  program.addCommand(login(config, api))
  program.addCommand(create(config, api))
  program.addCommand(executeCommand(config, api))
  program.addCommand(download(config, api))
  program.addCommand(backtest(config, api))

  return program.parse(process.argv)
})