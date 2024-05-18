import { RetursAnalyzer } from 'zptrade-backtest'

const config = {
  dataDir: "./example/data",
  apiUrl: "http://zapant.com/api",
  backtest: {
    date: "2024-04-01",
    window: 5,
    analyzers: [
      // new RetursAnalyzer()
    ]
  }
}

export default config;