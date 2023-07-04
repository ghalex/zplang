import * as signale from 'signale'
import { Args, Command } from '@oclif/core'
import chalk from 'chalk'
import shell from 'shelljs'

const log = new signale.Signale({ interactive: true, scope: 'zplang' })

const createProject = async (name: string) => {
  // return await new Promise((resolve, reject) => {
  // const ls = spawn('git', ['clone', 'https://github.com/zapant-com/zplang-hello.git', name])
  log.await('[%d/2] - Createing project %s', 1, chalk.cyanBright(name))
  const res = shell.exec(`git clone https://github.com/zapant-com/zplang-hello.git ${name}`)
  if (res.code === 0) {
    shell.rm('-rf', name + '/.git')
  } else {
    throw new Error(res.stderr)
  }

  // child.stdout?.on('data', function (data) {
  //   log.await(data.toString())
  // })

  // exec(`git clone https://github.com/zapant-com/zplang-hello.git ${name}`, (err, output) => {
  // // once the command has completed, the callback function is called
  //   if (err) {
  //   // log and return if we encounter an error
  //     reject(new Error('Could not create project with name ' + name))
  //     return
  //   }
  //   // log the output received from the command
  //   console.log(output)
  //   resolve(output)
  // })
  // })
}

export default class CreateCommand extends Command {
  static description = 'Create a new project'
  static examples = [
    '<%= config.bin %> <%= command.id %> {projectName}'
  ]

  static args = {
    name: Args.string({ required: true })
  }

  async run (): Promise<any> {
    const { args } = await this.parse(CreateCommand)
    // const version = shell.exec('node --version', { silent: true }).stdout

    try {
      await createProject(args.name)
      log.success('[%d/2] - Project %s created with success.', 2, chalk.cyanBright(args.name))
    } catch (err: any) {
      console.log(err)
      log.error('[%d/2] - Could not create project with name %s.', 1, args.name)
    }
  }
}
