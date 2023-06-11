// import * as fs from 'fs'
// import path from 'path'
import * as ohm from 'ohm-js'
import analyzer from './analyzer'
import { type Env } from './language'

// const data = fs.readFileSync(path.join(__dirname, 'zapant.ohm'), { encoding: 'utf-8' })
const grammar = ohm.grammar(String.raw`
Zapant {
  Program = Stmt+

  Stmt (statement)
      = "(" (id | operators) Exp* ")"                           --fnCall
      | "(" if Exp Stmt Stmt? ")"                               --if
      | "(" loop id? in (List | Stmt_fnCall | Var) Block ")"    --loop
      | "(" fn ListArgs Block ")"                               --fnDec 
      | "(" ":" id (Var | Asset | Assets) ")"                   --objGet
      | "(" def id (Stmt | Exp) ")"                             --varDec
      | Exp

  Block = Stmt+

  Exp
      = Stmt_fnCall
      | Stmt_fnDec
      | Stmt_objGet
      | List
      | Object
      | Assets
      | Asset 
      | Primary
      | Var
      

  Primary
      = strlit
      | floatlit
      | intlit
      | boolean
      | null

  List = "[" listOf<Exp, ","> "]"
  ListArgs = "[" listOf<id, ", "> "]"
  Object = "{" listOf<ObjItem, ",">  "}"
  ObjItem = id ":" Exp
  Var = id | operators
  Assets = "{" (upper+ | Var) "," (Var | intlit) bars "}"
  Asset = "{" (upper+ | Var) DaysAgo? "}"
  DaysAgo = "," (Var | intlit) "days ago"?  --nb
      | "," today                           --today
      | "," yesterday                       --yesterday

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
  yesterday = "yesterday" ~alnum
  today = "today" ~alnum
  keywords
      = def
      | if
      | fn
      | loop
      | in
      | yesterday
      | true
      | bars
      | today
      | yesterday
      | false
      | null

  strlit = "\"" char* "\""
  char = ~"\"" ~"\n"  any
  boolean = true | false
  intlit = ("+" | "-")* digit+
  floatlit = digit+ "." digit+
  id = ~keywords (letter | "_" | "$") idchar*
  idchar = letter | digit | "_" | "$"
  operators = "**" | "+" | "-" | "/" | "*" | "%" | "<=" | "<" | "=" | "!=" | ">=" | ">"

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

export * from './language'
export * as modules from './modules'
export default {
  parse,
  getAst,
  getMatcher,
  evalCode
}
