import parser from './parser'
import analyzer from './analyzer'

const sourceCode = String.raw`
    (def age: 2)
    (def name: "Alex")

    (print: "Name" + name)
`

const m = parser.parse(sourceCode)
const semantics = analyzer.createSemantics(parser.getGrammar(), m)
const adapter = semantics(m)
const ast = adapter.ast()

console.log('ast', ast)
