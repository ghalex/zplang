import * as fs from 'fs'
import * as ohm from 'ohm-js'

const data = fs.readFileSync('src/zapant.ohm', { encoding: 'utf-8'})
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