import type { MatchResult, Grammar, Node } from 'ohm-js'
import { FnCall, BinaryExpression, Expression, Variable, VarDec } from './core'

const createSemantics = (grammar: Grammar, match: MatchResult) => {
  const semantics = grammar.createSemantics()
  const ast = {
    Program (stmts) {
      return stmts.children.map(s => s.ast())
    },
    Stmt_fnCall (_left, fnName, _dots, args, _right) {
      return new FnCall(fnName.sourceString, args.ast())
    },
    Stmt_varDec (_left, _def, id: Node, _dots, exp: Node, _right) {
      const variable = new Variable(id.sourceString, 'any')
      const initializer = exp.ast()

      // context.set(variable.name, variable)
      return new VarDec(variable, initializer)
    },
    Exp_binary (left, op, right) {
      return new BinaryExpression(op.sourceString, left.ast(), right.ast())
    },
    Condition_binary (left, op, right) {
      return new BinaryExpression(op.sourceString, left.ast(), right.ast())
    },
    Term_binary (left, op, right) {
      return new BinaryExpression(op.sourceString, left.ast(), right.ast())
    },
    Factor_binary (left: Node, op: Node, right: Node) {
      return new BinaryExpression(op.sourceString, left.ast(), right.ast())
    },
    Exp (val: Node) {
      return new Expression(val.ast())
    },
    Var (val) {
      // const entity = context.get(val.sourceString)
      // if (!entity) throw new Error(`Identifier "${val.sourceString}" not declared`)

      return ''
    },
    true (_) {
      return true
    },
    false (_) {
      return false
    },
    intlit (digits) {
      return parseInt(digits.sourceString)
    },
    floatlit (digits1: Node, _dot, digits2: Node) {
      return parseFloat(digits1.sourceString + '.' + digits2.sourceString)
    },
    strlit (_a1, chars: Node, _a2) {
      return chars.ast().join('')
    },
    _terminal () {
      return (this as any).sourceString
    },
    _iter (...children: Node[]) {
      return children.map(c => c.ast())
    }
  }

  semantics.addOperation('ast', ast)

  return semantics
}

export default {
  createSemantics
}
