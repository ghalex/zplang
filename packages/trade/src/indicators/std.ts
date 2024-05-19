import type { IndicatorOptions } from '../types'
import * as r from 'ramda'
import array from '../helpers/array'
import { standardDeviation } from 'simple-statistics'

const std = (len: number, bars: number[], { roll, offset, prop }: IndicatorOptions): any => {
  const minLen = len + (roll ?? 0) + (offset ?? 0)
  const data = r.pluck(prop ?? 'close', bars)

  if (data.length < len + (roll ?? 0) + (offset ?? 0)) {
    throw new Error(`std: data.length must be bigger then ${len}`)
  }

  const res = array.rolling(
    { window: len, partial: false },
    (arr: any[]) => standardDeviation(arr as number[]),
    r.take(len + (roll ?? 0), data.slice(offset ?? 0))
  )
    .filter((val: any) => val)

  return roll ? res : res[0]
}

export default std
