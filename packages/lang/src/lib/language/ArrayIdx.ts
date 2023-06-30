
const nth = (idx, arr) => {
  function getIdx (i, a) {
    if (Array.isArray(i)) {
      const [curr, ...rest] = i
      return getIdx(rest.length > 1 ? rest : rest[0], a[curr])
    }

    if (i < 0) {
      return a[(a.length + i) % a.length]
    }

    return a[i % a.length]
  }

  return getIdx(idx, arr)
}

class ArrayIdx {
  constructor (public arrName: string, public idx: number) {}

  eval (env) {
    const arr = env.get(this.arrName)

    if (!Array.isArray(arr)) throw Error(this.arrName + 'must be an array')

    return nth(this.idx, arr)
  }

  toString () {
    return `${this.arrName}[${this.idx}]`
  }
}

export default ArrayIdx
