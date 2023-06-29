import dayjs from 'dayjs'
import * as r from 'ramda'
import type { OrderAction, Order, Position } from './types'

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

export const balance = (orders: Order[], positions: Position[], context: { bars: any }) => {
  const resultOrders: Order[] = []

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

export const calcStats = (position: Position, price: number, units: number) => {
  const pl = (price - position.openPrice) * units * (position.side === 'long' ? 1 : -1)
  const value = position.openPrice * units

  return {
    pl,
    plPct: pl / value,
    currentPrice: price
  }
}

export const createPosition = (order: Order): Position => {
  const data = {
    symbol: order.symbol,
    openDate: order.date,
    openPrice: order.price,
    closeDate: null,
    closePrice: null,
    units: order.units,
    side: order.action === 'buy' ? 'long' : 'short' as 'long' | 'short',
    accountType: 'paper',
    stats: {
      pl: 0,
      plPct: 0,
      currentPrice: order.price
    }
  }

  return data
}

export const createClosePosition = (position: Position, order: Order): Position => {
  const data = {
    symbol: position.symbol,
    openDate: position.openDate,
    openPrice: position.openPrice,
    closeDate: order.date,
    closePrice: order.price,
    units: order.units,
    side: position.side,
    accountType: 'paper',
    stats: calcStats(position, order.price, order.units)
  }

  return data
}

export const sameSide = (position: Position, order: Order) => {
  return (position.side === 'long' && order.action === 'buy') || (position.side === 'short' && order.action === 'sell')
}

export const executeOrders = (orders: Order[], openPositions: Position[], capital?: number) => {
  const newPositions: Position[] = openPositions.map(p => ({ ...p }))
  const failedOrders: Order[] = []

  let capitalRequired = 0
  let capitalAvailable = capital ?? Number.MAX_VALUE

  for (const execution of orders) {
    const position = r.find(p => p.symbol === execution.symbol, newPositions)
    if (position) {
      if (sameSide(position, execution)) {
        capitalRequired += execution.units * execution.price

        if (capitalAvailable >= capitalRequired) {
          position.openPrice = (position.units * position.openPrice + execution.units * execution.price) / (position.units + execution.units)
          position.units = position.units + execution.units
          position.stats = calcStats(position, execution.price, position.units)
        } else {
          failedOrders.push(execution)
        }
      } else {
        if (position.units > execution.units) {
          position.units = position.units - execution.units
          position.stats = calcStats(position, execution.price, position.units)

          newPositions.push(createClosePosition(position, execution))

          capitalAvailable += execution.units * execution.price
        } else {
          // close position
          position.closeDate = execution.date
          position.closePrice = execution.price
          position.stats = calcStats(position, execution.price, position.units)

          capitalAvailable += position.units * execution.price

          // open new position in different direction
          if (position.units < execution.units) {
            const newPosition = createPosition({
              ...execution,
              units: execution.units - position.units
            })

            capitalRequired += newPosition.units * newPosition.openPrice

            if (capitalAvailable >= capitalRequired) {
              newPositions.push(newPosition)
            } else {
              failedOrders.push(execution)
            }
          }
        }
      }
    } else {
      const newPosition = createPosition(execution)
      capitalRequired += newPosition.units * newPosition.openPrice

      if (capitalAvailable >= capitalRequired) {
        newPositions.push(newPosition)
      } else {
        failedOrders.push(execution)
      }
    }
  }

  return { newPositions, capitalAvailable, failedOrders }
}
