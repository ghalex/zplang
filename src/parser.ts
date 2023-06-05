import * as fs from 'fs'
import * as ohm from 'ohm-js'
import path from 'path'

const data = fs.readFileSync(path.join(__dirname, 'zapant.ohm'), { encoding: 'utf-8' })
const grammar = ohm.grammar(data)

const parse = (sourceCode: string) => {
  const match = grammar.match(sourceCode)

  if (!match.succeeded()) throw new Error(match.message)
  return match
}

export default {
  parse,
  getGrammar: () => grammar
}
