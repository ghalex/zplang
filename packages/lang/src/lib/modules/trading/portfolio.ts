import type { Order, Position } from './types'

class Portfolio {
  private readonly _data = {
    capital: 0,
    capitalAvailable: 0,
    orders: [] as Order[],
    positions: [] as Position[]
  }

  constructor (initialCapital: number, positions: Position[]) {
    this._data.positions = positions.concat()
  }

  public get openPositions () {
    return this._data.positions.concat().filter(p => p.closeDate === null)
  }

  public get data () {
    return { ...this._data }
  }
}

export default Portfolio
