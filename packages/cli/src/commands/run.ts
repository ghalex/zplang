import clc from 'cli-color'

import { Command } from 'commander'

const program = new Command('run')

program
  .description('run a zplang file')
  .argument('file', 'File to run')
  .option('-d, --debug', 'display some debugging')
  .action(async (file, opts) => {
    //console.log(`Running file: ${file} with options ${JSON.stringify(opts)}`)
  })

export default program