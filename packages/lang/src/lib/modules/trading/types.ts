
export type OrderAction = 'buy' | 'sell'
export interface Order {
  symbol: string
  date: number
  dateFormatted: string
  units: number
  price: number
  action: OrderAction
}

export type PositionSide = 'long' | 'short'
export interface Position {
  symbol: string
  openDate: number
  openPrice: number
  closeDate: number | null
  closePrice: number | null
  units: number
  side: 'long' | 'short'
  accountType: string
  stats: {
    pl: number
    plPct: number
    currentPrice: number
  }
}

export interface OrderOptions {
  target?: boolean
}
