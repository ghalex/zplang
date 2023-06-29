import dayjs from 'dayjs'
import type { Order, OrderAction, OrderOptions, Position } from './types'
import { balance, closePositions, executeOrders } from './utils'

class Portfolio {
  private readonly _data = {
    initialCapital: 0,
    orders: [] as Order[],
    positions: [] as Position[]
  }

  constructor (initialCapital: number, positions: Position[]) {
    this._data.initialCapital = initialCapital
    this._data.positions = positions.concat()
  }

  public get openPositions () {
    return this._data.positions.concat().filter(p => p.closeDate === null)
  }

  public get data () {
    return { ...this._data }
  }

  public set data (value) {
    this._data.initialCapital = value.initialCapital ?? this._data.initialCapital
    this._data.positions = value.positions ?? this._data.positions
    this._data.orders = value.orders ?? this._data.orders
  }

  public balance (bars: any[]) {
    const openPositions = this.openPositions
    const orders = this.data.orders

    this._data.orders = balance(orders, openPositions, { bars })
    return this._data.orders
  }

  public closePositions (positionsToClose: Position[], bars: any[]) {
    const orders = closePositions(positionsToClose, { bars })
    this._data.orders = [...this._data.orders, ...orders]

    return orders
  }

  public order (asset, action: OrderAction, qty: number, options: OrderOptions, bars: any[]) {
    const order: Order = {
      symbol: asset.symbol,
      date: asset.date,
      dateFormatted: dayjs(asset.date).toISOString(),
      price: asset.close,
      units: qty,
      action
    }

    if (options.target) {
      const [newOrder] = balance([order], this.openPositions.filter(p => p.symbol === order.symbol), { bars })

      if (newOrder) {
        this._data.orders.push(newOrder)
      }

      return newOrder ?? {}
    } else {
      this._data.orders.push(order)
      return order
    }
  }

  public execute (orders: Order[]) {
    const { newPositions } = executeOrders(orders, this.openPositions)
    return newPositions
  }
}

export default Portfolio
