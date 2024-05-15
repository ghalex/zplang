import * as r from 'ramda'
import { floor } from '../utils'

class Broker {
  cash: number = 10_000
  cashStart: number = 10_000
  comission: number = 0
  orders: any[] = []
  positions: any[] = []
  data: any = {}
  eventHandler: any = null

  constructor (cash?: number, comission?: number) {
    this.cash = this.cashStart = cash ?? 10_000
    this.comission = comission ?? 0
  }

  setCash(val: number) {
    this.cash = this.cashStart = val
  }

  setCommision(val: number) {
    this.comission = val
  }

  setData(data: any) {
    this.data = data
  }

  setEventHandler(evtHandler: any) {
    this.eventHandler = evtHandler
  }

  getCash() {
    return floor(this.cash, 2)
  }

  getCashStart() {
    return floor(this.cashStart, 2)
  }

  getValue() {
    return floor(this.cash + this.getOpenPositions().reduce((acc, p) => acc + (p.units * this.data[p.symbol][0].close), 0), 2)
  }

  getInvested() {
    return floor(this.getOpenPositions().reduce((acc, p) => acc + (p.units * p.openPrice), 0), 2)
  }

  getPL() {
    return floor(this.getValue() - this.cashStart, 2)
  }

  getPositions() {
    return this.positions
  }

  getOpenPositions() {
    return this.positions.filter(p => !p.closeDate)
  }

  openPosition (order: any) {
    const data: any = {
      symbol: order.symbol,
      openDate: order.fillDate,
      openPrice: order.fillPrice,
      openBar: order.fillBar,
      closeDate: null,
      closePrice: null,
      closeBar: null,
      units: order.fillUnits,
      side: order.action === 'buy' ? 'long' : 'short' as 'long' | 'short'
    }

    return data
  }

  closePosition (position: any, order: any) {
    const data: any = {
      symbol: position.symbol,
      openDate: position.openDate,
      openPrice: position.openPrice,
      closeDate: order.fillDate,
      closePrice: order.fillPrice,
      closeBar: order.fillBar,
      units: position.units,
      side: position.side
    }

    return data
  }

  closeAllPositions () {
    for( const position of this.getOpenPositions()) {
      const bars = this.data[position.symbol]
      const order = {
        symbol: position.symbol,
        date: bars[0].date,
        price: bars[0].close,
        action: position.side === 'long' ? 'sell' : 'buy',
        units: position.units,
        status: 'created'
      }

      this.fillOrder(order, bars)
    }
  }

  sameSide (position, order) {
    return (position.side === 'long' && order.action === 'buy') || (position.side === 'short' && order.action === 'sell')
  }

  canFill(order: any, bar: any) {
    const fillCost = bar.close * order.units
    const fillCommision = this.comission * fillCost
    const p = r.find((p: any) => p.symbol === order.symbol, this.positions)

    if (!p) {
      return this.cash >= (fillCost + fillCommision)
    } else {
      if (this.sameSide(p, order)) {
        return this.cash >= (fillCost + fillCommision)
      } else {
        const diffAmmount = (order.units - p.units) * bar.close

        if (diffAmmount > 0) {
          return this.cash >= diffAmmount + (diffAmmount * this.comission)
        }
      }
    }

    return true
  }

  fillOrder(order: any, bars: any) {
    const bar = bars[0]
    const fillPrice = bar.close
    const fillDate = bar.date
    const fillUnits = order.units
    const fillCost = fillPrice * fillUnits
    const fillCommision = this.comission * fillCost

    let data = {
      ...order,
      fillPrice,
      fillDate,
      fillUnits,
      fillCost,
      fillCommision,
      fillBar: bars.length - 1,
      error: null,
      status: 'filled'
    }

    if (this.canFill(order, bar)) {

      this.eventHandler?.onOrder(data)
      this.executeOrder(data)

      return data
    } else {
      data = {
        ...order,
        error: 'Insufficient funds',
        status: 'rejected'
      }

      this.eventHandler?.onOrder(data)
      return data
    }
  }

  fillOrders(orders: any) {
    return orders.map((order: any) => this.fillOrder(order, this.data[order.symbol]))
  }

  executeOrder(order: any) {
    const p = r.find((p: any) => p.symbol === order.symbol, this.positions.filter(p => !p.closeDate))

    if (p) {
      if (this.sameSide(p, order)) {
        p.openPrice = (p.openPrice + order.fillPrice) / 2
        p.units += order.fillUnits

        this.cash -= order.fillCost + order.fillCommision
      } else {
        if (floor(p.units, 6) > floor(order.fillUnits, 6)) {
          // Close part of the position
          p.units -= order.fillUnits
          this.cash += order.fillCost - order.fillCommision
          this.positions.push(this.closePosition(p, order))

        } else {
          // Close the position
          p.closeDate = order.fillDate
          p.closePrice = order.fillPrice
          p.closeBar = order.fillBar

          this.cash += order.fillCost - order.fillCommision

          const diffAmmount = floor((order.fillUnits - p.units) * order.fillPrice, 2)

          if (diffAmmount > 2) {
            const newPosition = {...this.openPosition(order), units: order.fillUnits - p.units}

            this.positions.push(newPosition)
            this.cash -= diffAmmount + (diffAmmount * this.comission)
          }
        
        }
      }
    } else {
      this.positions.push(this.openPosition(order))
      this.cash -= order.fillCost + order.fillCommision
    }

    return this.positions
  }
}

export default Broker