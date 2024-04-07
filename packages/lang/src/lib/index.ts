// import * as fs from 'fs'
// import path from 'path'
import * as ohm from 'ohm-js'
import analyzer from './analyzer'
import { Lambda, type Env } from './language'

// const data = fs.readFileSync(path.join(__dirname, 'zapant.ohm'), { encoding: 'utf-8' })
// | "(" ":" id "!"? Exp (Var | Asset | Assets) ")"          --objSet
const grammar = ohm.grammar(String.raw`
Zapant {
  Program = Stmt+

  Stmt (statement)
      = "(" ( idmodule | id | operators) Exp* ")"               --fnCall
      | "(" if Exp Stmt Stmt? ")"                               --if
      | "(" loop id? in (List | Stmt_fnCall | Var) Block ")"    --loop
      | "(" fn ListArgs Block ")"                               --fnDec
      | ListArgs "=>" Exp                                       --fnDec2
      | "(" ":" id (Var | Asset | Assets | Stmt_fnCall) ")"     --objGet
      | "(" def id (Stmt | Exp) ")"                             --varDec
      | "(" defn id ListArgs Block ")"                          --fnDec3
      | "(" import strlit (as id)? ")"                          --import
      | "(" let LetList Block ")"                               --let
      | "(" do Block ")"                                        --do
      | "(" return Exp ")"                                      --return
      | "#" pragma id (Primary | List | Object)                 --pragma
      | Exp

  Block = Stmt+

  Exp
      = Stmt_fnCall
      | Stmt_fnDec
      | Stmt_fnDec2
      | Stmt_objGet
      | ArrayIdx
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
      | nil

  ArrayIdx = id "[" intlit "]"
  List = "[" listOf<Exp, ","> "]"
  ListArgs = "[" listOf<id, ", "> "]"
  LetItem = id Exp
  LetList = "[" listOf<LetItem, ","> "]"
  Object = "{" listOf<ObjItem, ",">  "}"
  ObjItem = (id | strlit) ":" Exp
  Var = id
  AssetId = (upper+ "/" upper+)   --coin
  | (upper+)                      --simple
  | Var                           --var

  Assets = "{" AssetId "," (Var | intlit) bars DaysAgo? "}"
  Asset = "{" AssetId DaysAgo? "}"
  DaysAgo = "," (Var | intlit) "days ago"?  --nb
      | "," today                           --today
      | "," yesterday                       --yesterday

  def = "def" ~alnum
  defn = "defn" ~alnum
  if = "if" ~alnum
  fn = "fn" ~alnum
  loop = "loop" ~alnum
  in = "in" ~alnum
  let = "let" ~alnum
  do = "do" ~alnum
  true = "true" ~alnum
  false = "false" ~alnum
  null = "null" ~alnum
  nil = "nil" ~alnum
  bars = "bars" ~alnum
  daysAgo = "days ago" ~alnum
  yesterday = "yesterday" ~alnum
  today = "today" ~alnum
  return = "return" ~alnum
  pragma = "pragma" ~alnum
  import = "import" ~alnum
  as = ":as" ~alnum
  keywords
      = def
      | defn
      | import
      | as
      | if
      | fn
      | loop
      | in
      | yesterday
      | true
      | let
      | pragma
      | do
      | bars
      | today
      | yesterday
      | false
      | return
      | nil
      | null

  strlit = "\"" char* "\""
  char = ~"\"" ~"\n"  any
  boolean = true | false
  intlit = ("+" | "-")* digit+
  floatlit = ("+" | "-")* digit+ "." digit+
  id = ~keywords (letter | "_" | "$") idchar* "!"?
  idmodule = ~keywords letter idchar* "/" id
  idchar = letter | digit | "_" | "$"
  operators = "**" | "+" | "-" | "/" | "*" | "%" | "<=" | "<" | "=" | "!=" | ">=" | ">" | "??"

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

const evalAst = (env: Env, ast: any[]) => {
  return ast.map(stmt => {
    const x = stmt.eval(env)

    if (x instanceof Lambda) {
      return 'lamda ' + x.toString()
    }

    if (typeof x === 'object') {
      if (Array.isArray(x)) return [...x]
      return { ...x }
    }
    return x
  })
}

const evalMatch = (env: Env, m: ohm.MatchResult) => {
  const semantics = analyzer.createSemantics(grammar, m)
  const ast = semantics(m).ast() as any[]

  return ast.map(s => s.eval?.(env))
}

const evalCode = (env: Env, code: string) => {
  const ast = getAst(code)
  return evalAst(env, ast)
}

export * from './language'
export * as modules from './modules'
export {
  parse,
  getAst,
  getMatcher,
  evalCode,
  evalMatch,
  evalAst
}
