#!/usr/bin/env node
import figlet from 'figlet'

import { Command } from 'commander'
import createApi from './api'
import create from './commands/create'
import executeCommand from './commands/execute'
import login from './commands/login'
import download from './commands/download'
import backtest from './commands/backtest'
import config from './config'

import { exit } from 'node:process'

figlet("zplang-cli", (err, data) => {


  const logoText = err ? 'zplang CLI' : data + '\n'
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