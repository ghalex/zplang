#!/usr/bin/env node
import figlet from 'figlet'

import clc from 'cli-color'
import { Command } from 'commander'
import create from './commands/create'
import executeCommand from './commands/execute'
import login from './commands/login'
import download from './commands/download'
import backtest from './commands/backtest'
import view from './commands/view'

figlet("zplang-cli", async (err, data) => {

  const logoText = err ? 'zplang CLI' : data + '\n'
  const program = new Command()

  program
    .name('zplang')
    .version('1.0.6')
    .usage("command [options]")
    .addHelpText('beforeAll', logoText)

  program.addCommand(login())
  program.addCommand(create())
  program.addCommand(executeCommand())
  program.addCommand(download())
  program.addCommand(backtest())
  program.addCommand(view())

  return program.parse(process.argv)

})