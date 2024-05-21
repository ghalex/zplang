import { analyzers } from 'zptrade-backtest'

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
    date: "2024-05-01",
    window: 5,
    saveResult: "./example/result.json",
    inputs: {
      assets: []
    },
    analyzers: [
      // new RetursAnalyzer()
      // new analyzers.PositionsAnalyzer()
    ]
  }
}

export default config;