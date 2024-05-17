import loadConfig from '@/config'
import { Command } from 'commander'
import prompts from 'prompts'
import { auth } from '@/api'
import storage from '@/storage'

const program = new Command('login')

export default () => {
  program
    .description('login to zapant.com')
    .action(async () => {
        const { email } = await prompts({ type: 'text', name: 'email', message: 'Enter your email', initial: 'ex. yoda@gmail.com', validate: x => x.length > 3})
        const { pass } = await prompts({ type: 'password', name: 'pass', message: 'Enter your password' })

        const config = await loadConfig()
        const data = await auth(config).login(email, pass)

        if (data) {
          const accessToken = data.accessToken
          const user = data.user

          storage.set('accessToken', accessToken)
          storage.set('user', user)
        }
    })

  return program
}