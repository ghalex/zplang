import clc from 'cli-color'

import { Command } from 'commander'
import { Spinner } from 'cli-spinner'
import prompts from 'prompts'
import axios from 'axios'
import ora from 'ora'


const program = new Command('login')
const API_URL = 'https://zapant.com/api'

/**
 * Login to zapant.com
 * @param email 
 * @param password 
 * @returns 
 */
const login = (email: string, password: string) => {
  // const spinner = new Spinner('Authenticating with credentials on zapant.com')
  const spinner = ora('Authenticating with credentials on zapant.com').start()

  //spinner.setSpinnerString(2)
  //spinner.start()
  return axios.post(`${API_URL}/auth/login`, { email, password, strategy: 'local' })
    .then(res => res.data)
    .then(data => {
      spinner.succeed()
      // spinner.clearLine(process.stdout)
      console.log(`${clc.green('✔ Success: ')} Login was successfull`)
      console.log(`${clc.green('✔ User: ')} ${data.user.name} (${data.user.email})`)

      return data
    })
    .catch(err => {
      spinner.fail()
      // spinner.clearLine(process.stdout)

      console.log(`${clc.red('✖ Error: ')} ${err.response.data.message}.`)
      console.log(`${clc.red('✖')} Login ${clc.red('failed')}`)

      return null

    })
}

/**
 * Login command
 */
export default (config: any) => {
  program
    .description('login to zapant.com')
    .action(async (opts) => {
        const { email } = await prompts({ type: 'text', name: 'email', message: 'Enter your email', initial: 'ex. yoda@gmail.com', validate: x => x.length > 3})
        const { pass } = await prompts({ type: 'password', name: 'pass', message: 'Enter your password' })

        const data = await login(email, pass)

        if (data) {
          const accessToken = data.accessToken
          const user = data.user

          config.set('accessToken', accessToken)
          config.set('user', user)
        }
    })

  return program
}