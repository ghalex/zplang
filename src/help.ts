
export const evalExpression = (e, env) => e?.eval ? e.eval(env) : e
