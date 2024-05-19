import type { IndicatorOptions, Bar } from '../types'
import { take, mean } from 'ramda'
import trueRange from './trueRange'
import array from '../helpers/array'

const atr = (len: number = 5, data: Bar[], { roll, offset }: IndicatorOptions): any => {
  const minLen = len + (roll ?? 0) + (offset ?? 0)

  if (data.length < minLen) {
    throw new Error(`atr: data.length must be bigger then ${minLen}`)
  }

  const res = array.rolling(
    { window: len, partial: false },
    (arr: any[]) => {
      const tr = trueRange(arr as Bar[])

      return mean(tr)
    },
    take(len + (roll ?? 0), data.slice(offset ?? 0))
  )
    .filter((val: any) => val)

  return roll ? res : res[0]
}

export default atr
