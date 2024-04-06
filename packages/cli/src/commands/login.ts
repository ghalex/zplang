import { type Api } from '@/api'
import { Command } from 'commander'
import prompts from 'prompts'

const program = new Command('login')

export default (config: any, api: Api) => {
  program
    .description('login to zapant.com')
    .action(async (opts) => {
        const { email } = await prompts({ type: 'text', name: 'email', message: 'Enter your email', initial: 'ex. yoda@gmail.com', validate: x => x.length > 3})
        const { pass } = await prompts({ type: 'password', name: 'pass', message: 'Enter your password' })

        const data = await api.auth.login(email, pass)

        if (data) {
          const accessToken = data.accessToken
          const user = data.user

          config.set('accessToken', accessToken)
          config.set('user', user)
        }
    })

  return program
}