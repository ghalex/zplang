import type { Bar, IndicatorOptions } from '../types'
import array from '../helpers/array'
import * as r from 'ramda'

const lowest = (len: number, bars: Bar[], { roll, offset, prop }: IndicatorOptions): any => {
  const minLen = len + (roll ?? 0) + (offset ?? 0)
  const data = r.pluck(prop ?? 'close', bars)

  if (data.length < len + minLen) {
    throw new Error(`lowest: data.length ${data.length} must be bigger then ${minLen}`)
  }

  const res = array.rolling(
    { window: len, partial: false },
    (arr: any[]) => Math.min(...arr as number[]),
    r.take(len + (roll ?? 0), data.slice(offset ?? 0))
  )
  .filter((val: any) => val)

  return roll ? res : res[0]
}

export default lowest
