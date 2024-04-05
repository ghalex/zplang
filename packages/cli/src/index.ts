#!/usr/bin/env node
import figlet from 'figlet'
import clc from 'cli-color'

import { Command } from 'commander'

import create from './commands/create'
import runCommand from './commands/run'
import login from './commands/login'

import Configstore from 'configstore'

figlet("Zplang CLI", (err, data) => {
  const logoText = err ? 'zplang CLI' : data + '\n'
  const program = new Command()
  const config = new Configstore('zplang')

  program
    .name('zplang')
    .version('0.0.1')
    .usage("command [options]")
    .description('zplang CLI tool')
    .addHelpText('beforeAll', logoText)

  program.addCommand(runCommand)
  program.addCommand(create)
  program.addCommand(login(config))

  program.parse(process.argv)
})