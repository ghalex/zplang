const path = require('path')
const esbuild = require('rollup-plugin-esbuild').default

const name = 'zplang-cli'

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
      'zplang'
    ],
    plugins: [
      esbuild()
    ],
    output: [
      {
        file: path.resolve(__dirname, `dist/${name}.es.mjs`),
        format: 'es'
      }
    ]
  }
]