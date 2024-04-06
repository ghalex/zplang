#!/usr/bin/env node
import figlet from 'figlet'

import { Command } from 'commander'
import createApi from './api'
import create from './commands/create'
import executeCommand from './commands/execute'
import login from './commands/login'
import download from './commands/download'

import Configstore from 'configstore'

figlet("Zplang CLI", (err, data) => {
  const logoText = err ? 'zplang CLI' : data + '\n'
  const config = new Configstore('zplang', { 'dataDir':  'data', 'apiUrl': 'https://zapant.com/api' }, { configPath: './zpconfig.json' })
  const api = createApi(config)

  const program = new Command()

  program
    .name('zplang')
    .version('0.0.1')
    .usage("command [options]")
    .description('zplang CLI tool')
    .addHelpText('beforeAll', logoText)

  program.addCommand(executeCommand(config, api))
  program.addCommand(create(config, api))
  program.addCommand(login(config, api))
  program.addCommand(download(config, api))

  program.parse(process.argv)
})