import { RetursAnalyzer } from 'zptrade-backtest'

const config = {
  dataDir: "./example/data",
  apiUrl: "http://zapant.com/api",
  inputs: {
    assets: ["AAPL", "MSFT"],
    initialCapital: 10000,
    openPositions: [{
      symbol: 'AAPL',
      openDate: 1682366400000,
      openPrice: 200.00,
      closeDate: null,
      closePrice: null,
      units: 5,
      side: 'long',
      accountType: 'paper'
    }]
  },
  backtest: {
    date: "2024-04-01",
    window: 5,
    analyzers: [
      new RetursAnalyzer()
    ]
  }
}

export default config;