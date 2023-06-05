import type { MatchResult, Grammar, Node } from 'ohm-js'
import { FnCall, BinaryExpression, Expression, Variable, VarDec, Strlit, List, FnDec, IfElse, Loop } from './core'

const createSemantics = (grammar: Grammar, match: MatchResult) => {
  const semantics = grammar.createSemantics()
  const ast = {
    Program (stmts) {
      return stmts.children.map(s => s.ast())
    },
    Stmt_if (_l, _if, _p1, exp, _p2, _dots, yesStmt, noStmt, _r) {
      return new IfElse(exp.ast(), yesStmt.ast(), noStmt.ast())
    },
    Stmt_loop (_l, _loop, id, _in, list, _dots, block, _p2) {
      return new Loop(id.sourceString, list.ast(), block.ast())
    },
    Stmt_fnDec (_left, _fn, args, _dots, block, _right) {
      return new FnDec(args.ast(), block.ast())
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
    List (p1, expressions, p2) {
      return new List(expressions.asIteration().children.map(c => c.ast()))
    },
    ListArgs (_l, args, _r) {
      return args.asIteration().children.map(c => c.sourceString)
    },
    Var (val) {
      return new Variable(val.sourceString, 'any')
    },
    true (_) {
      return true
    },
    false (_) {
      return false
    },
    intlit (sign, digits) {
      return parseInt(sign.sourceString + digits.sourceString)
    },
    floatlit (digits1: Node, _dot, digits2: Node) {
      return parseFloat(digits1.sourceString + '.' + digits2.sourceString)
    },
    strlit (_a1, chars: Node, _a2) {
      return new Strlit(chars.ast().join(''))
    },
    null (val) {
      return null
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
