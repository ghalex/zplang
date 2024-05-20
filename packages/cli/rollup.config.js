const path = require('path')
const esbuild = require('rollup-plugin-esbuild').default
const json = require('@rollup/plugin-json')

const name = 'zptrade-cli'

module.exports = [
  {
    input: 'src/index.ts',
    external: [
      'figlet',
      'commander',
      'configstore',
      'ora',
      'zlib',
      'prompts',
      'shelljs',
      'ramda',
      'axios',
      'cli-color',
      'node:fs',
      'node:path',
      'node:os',
      'node:zlib',
      'zplang',
      'zptrade',
      'zptrade-backtest',
      'dayjs',
      'dayjs/plugin/duration',
      'voca'
    ],
    plugins: [
      esbuild(),
      json()
    ],
    output: [
      {
        file: path.resolve(__dirname, `dist/${name}.es.mjs`),
        format: 'es'
      }
    ]
  }
]