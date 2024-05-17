import { Command } from 'commander'
import loadConfig from '../config'
import storage from '../storage'

const program = new Command('view')

export default () => {
  program
    .description('view configuration object')
    .argument('name', 'object to view ex. config, storage')
    .action(async (name: string) => {
      
      switch (name) {
        case 'config':
            const config = await loadConfig()
            console.dir(config, { depth: null, colors: true })
          break;

        case 'storage':
            console.dir(storage.all, { depth: null, colors: true })
          break;
        
        default:
          console.log('Invalid object to view. Please use config or storage.')
          break;
      }
    })

  return program
}