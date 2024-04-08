#!/usr/bin/env node
import figlet from 'figlet'

import os from 'node:os'
import { Command } from 'commander'
import createApi from './api'
import create from './commands/create'
import executeCommand from './commands/execute'
import login from './commands/login'
import download from './commands/download'

import Configstore from 'configstore'
import { exit } from 'node:process'

figlet("zplang-cli", (err, data) => {
  const homedir = os.homedir()
  const logoText = err ? 'zplang CLI' : data + '\n'
  const config = new Configstore('zplang', { 'dataDir':  homedir + '/.zp/data', 'apiUrl': 'https://zapant.com/api' }, { configPath: homedir + '/.zp/zpconfig.json' })
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

  return program.parse(process.argv)
})