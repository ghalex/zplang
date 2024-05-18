import { Bars, Order, OrderAction } from "../types"
import { floorNumber } from "./number"
import dayjs from "dayjs"

/**
 * Create orders based on the weights and units
 * @param symbols 
 * @param weights 
 * @param units 
 * @param action 
 * @param round 
 * @returns 
 */
const createOrdersUnits = (symbols: string[], weights: Record<string, number>, units: number, action: OrderAction, bars: Bars, round?: boolean) => {
  const res: Order[] = []

  for (const symbol of symbols) {
    const today = bars[symbol][0]
    const datetime = dayjs(today?.date).isSame(dayjs(), 'day') ? Date.now() : today.date

    const order: Order = {
      symbol: today.symbol,
      date: datetime,
      dateFormatted: dayjs(datetime).toISOString(),
      price: today.close,
      units: round ? Math.floor(weights[symbol] * units) : floorNumber(weights[symbol] * units, 6),
      action,
      status: 'created'
    }

    res.push(order)
  }


  return res
}

/**
 * Create orders based on the weights and amount
 * @param symbols 
 * @param weights 
 * @param amount 
 * @param action 
 * @param round 
 * @returns 
 */
const createOrdersAmount = (symbols: string[], weights: Record<string, number>, amount: number, action: OrderAction, bars: Bars, round?: boolean) => {
  const res: Order[] = []

  for (const symbol of symbols) {
    const today = bars[symbol][0]
    const cash = amount * Math.abs(weights[symbol])
    const price = today.close
    const units = round ? Math.floor(cash / price) : floorNumber(cash / price, 6)
    const datetime = dayjs(today?.date).isSame(dayjs(), 'day') ? Date.now() : today.date

    const order: Order = {
      symbol: today.symbol,
      date: datetime,
      dateFormatted: dayjs(datetime).toISOString(),
      price,
      units,
      action,
      status: 'created'
    }

    res.push(order)
  }

  return res
}

export default {
  createOrdersUnits,
  createOrdersAmount
}