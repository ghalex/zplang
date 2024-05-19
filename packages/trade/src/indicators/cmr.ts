import type { IndicatorOptions } from '../types'
import { take } from 'ramda'
import array from '../helpers/array'

const cmr = (len: number, data: number[], { roll, offset }: IndicatorOptions): any => {
  const minLen = len + (roll ?? 0) + (offset ?? 0)
  if (data.length < minLen) {
    throw new Error(`cmr: data.length must be bigger then ${minLen}`)
  }

  const res = array.rolling(
    { window: len, partial: false },
    (arr: any[]) => {
      const vals = arr as number[]
      return (vals[0] - vals[vals.length - 1]) / vals[vals.length - 1]
    },
    take(len + (roll ?? 0), data.slice(offset ?? 0))
  )
    .filter((val: any) => val)

  return roll ? res : res[0]
}

export default cmr
