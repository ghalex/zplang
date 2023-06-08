import * as fs from 'fs'

export const ifelse = fs.readFileSync('src/examples/ifelse.zp', { encoding: 'utf-8' })
export const loop = fs.readFileSync('src/examples/loop.zp', { encoding: 'utf-8' })
export const core = fs.readFileSync('src/examples/core.zp', { encoding: 'utf-8' })
export const functions = fs.readFileSync('src/examples/functions.zp', { encoding: 'utf-8' })
