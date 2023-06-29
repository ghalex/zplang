import dayjs from 'dayjs'
import * as r from 'ramda'
import { type OrderAction, type Order } from './types'

export const roundNumber = function (n: number, d: number) {
  const r = Math.pow(10, d)
  return Math.round((n + Number.EPSILON) * r) / r
}

export const closePositions = (openPositions: any[], context: { bars: any }) => {
  const res: any[] = []

  for (const position of openPositions) {
    const bars = context.bars[position.symbol] ?? []
    const today = r.head<any>(bars)
    const action = position.side === 'long' ? 'sell' : 'buy'

    if (today) {
      const order: Order = {
        symbol: today.symbol,
        date: today.date,
        dateFormatted: dayjs(today.date).toISOString(),
        price: today.close,
        units: position.units ?? 0,
        action
      }

      res.push(order)
    }
  }

  return res
}

export const balance = (orders: any[], positions: any[], context: { bars: any }) => {
  const resultOrders: any[] = []

  if (orders.length === 0) {
    return resultOrders
  }

  // close all positions that I don't need
  for (const pos of positions) {
    if (!orders.some(o => o.symbol === pos.symbol)) {
      const [order] = closePositions([pos], context)
      resultOrders.push(order)
    }
  }

  for (const order of orders) {
    const symbol = order.symbol
    const pos = positions.find(p => p.symbol === symbol)
    const posDirection = pos?.side === 'long' ? 1 : -1
    const orderDirection = order.action === 'buy' ? 1 : -1

    if (!pos) {
      resultOrders.push(order)
    } else {
      const diff = (orderDirection * order.units) - (pos.units * posDirection)

      if (diff !== 0) {
        const action = diff > 0 ? 'buy' : 'sell'
        const [diffOrder] = createOrdersUnits([symbol], { [symbol]: 1 }, Math.abs(diff), { action, bars: context.bars })

        resultOrders.push(diffOrder)
      }
    }
  }

  return resultOrders
}

export const createOrdersUnits = (symbols: string[], weights: Record<string, number>, units: number, context: { bars: any, action: OrderAction, round?: boolean }) => {
  const { action, round } = context
  const res: any[] = []

  for (const symbol of symbols) {
    const today = context.bars[symbol][0]

    const order: Order = {
      symbol: today.symbol,
      date: today.date,
      dateFormatted: dayjs(today.date).toISOString(),
      price: today.close,
      units: round ? Math.floor(weights[symbol] * units) : weights[symbol] * units,
      action
    }

    res.push(order)
  }

  return res
}

export const createOrdersAmount = (symbols: string[], weights: Record<string, number>, amount: number, context: { bars: any, action: OrderAction, round?: boolean }) => {
  const { round, action } = context
  const res: any[] = []

  for (const symbol of symbols) {
    const today = context.bars[symbol][0]
    const cash = amount * weights[symbol]
    const price = today.close
    const units = round ? Math.floor(cash / price) : roundNumber(cash / price, 4)

    const order: Order = {
      symbol: today.symbol,
      date: today.date,
      dateFormatted: dayjs(today.date).toISOString(),
      price,
      units,
      action
    }

    res.push(order)
  }

  return res
}
