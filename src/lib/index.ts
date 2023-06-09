// import * as fs from 'fs'
// import path from 'path'
import * as ohm from 'ohm-js'
import analyzer from './analyzer'
import { type Env } from './core'

// const data = fs.readFileSync(path.join(__dirname, 'zapant.ohm'), { encoding: 'utf-8' })
const grammar = ohm.grammar(String.raw`
Zapant {
  Program = Stmt+

  Stmt (statement)
      = "(" (id | "+" | "-" | "/" | "*") Exp* ")"             --fnCall
      | "(" if "[" Exp "]" Stmt Stmt? ")"                     --if
      | "(" loop id? in (List | Stmt_fnCall | Var) Block ")"  --loop
      | "(" fn ListArgs Block ")"                             --fnDec 
      | "(" ":" id (Var | Asset | Assets) ")"                 --objGet
      | "(" def id (Stmt | Exp) ")"                           --varDec
      | Exp

  Block = Stmt+

  Exp
      = Condition relop Condition                 --binary
      | Condition

  Condition
      = Exp ("+" | "-") Term                      --binary
      | Term

  Term
      = Term ("*" | "/" | "%") Factor             --binary
      | Factor

  Factor
      = Primary "**" Factor                       --binary
      | Primary

  Primary
      = Stmt_fnCall
      | Stmt_fnDec
      | Stmt_objGet
      | List
      | Object
      | Assets
      | Asset
      | strlit
      | floatlit
      | intlit
      | boolean
      | null
      | Var

  List = "[" listOf<Exp, ","> "]"
  ListArgs = "[" listOf<id, ", "> "]"
  Object = "{" listOf<ObjItem, ",">  "}"
  ObjItem = id ":" Exp
  Var = id
  Assets = "{" upper+ "," (Var | intlit) bars "}"
  Asset = "{" upper+ ("," (Var | intlit) daysAgo?)? "}"

  def = "def" ~alnum
  if = "if" ~alnum
  fn = "fn" ~alnum
  loop = "loop" ~alnum
  in = "in" ~alnum
  true = "true" ~alnum
  false = "false" ~alnum
  null = "null" ~alnum
  bars = "bars" ~alnum
  daysAgo = "days ago" ~alnum
  keywords
      = def
      | if
      | fn
      | loop
      | in
      | true
      | bars
      | false
      | null

  strlit = "\"" char* "\""
  char = ~"\"" ~"\n"  any
  boolean = true | false
  intlit = ("+" | "-")* digit+
  floatlit = digit+ "." digit+
  id = ~keywords (letter | "__") idchar*
  idchar = letter | digit | "_"
  relop = "<=" | "<" | "==" | "!=" | ">=" | ">"

  eol = "\n" | "\r"
  comment = ";;" (~eol any)* eol*
  space += comment
}
`)

const parse = (sourceCode: string) => {
  const match = grammar.match(sourceCode)

  if (!match.succeeded()) throw new Error(match.message)
  return match
}

const getAst = (sourceCode: string) => {
  const m = parse(sourceCode)
  const semantics = analyzer.createSemantics(grammar, m)

  return semantics(m).ast() as any[]
}

const getMatcher = () => {
  return grammar.matcher()
}

const evalCode = (env: Env, m: ohm.MatchResult) => {
  const semantics = analyzer.createSemantics(grammar, m)
  const ast = semantics(m).ast() as any[]

  return ast.map(s => s.eval?.(env))
}

export * from './core'
export default {
  parse,
  getAst,
  getMatcher,
  evalCode
}
