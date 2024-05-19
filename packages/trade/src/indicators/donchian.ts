import * as r from 'ramda'
import { IndicatorOptions, type Bar } from '../types'
import highest from './highest'
import lowest from './lowest'

const donchian = (len: number = 5, data: Bar[], op: IndicatorOptions): any => {
  const minLen = len + (op.roll ?? 0) + (op.offset ?? 0)
  if (data.length < minLen) {
    throw new Error(`data.length must be bigger then ${minLen}`)
  }

  const h = highest(len, data, {...op, prop: 'high'})
  const l = lowest(len, data, {...op, prop: 'low'})

  return [h, l]
}

export default donchian
