import { RetursAnalyzer } from 'zplang-backtest'

const config = {
  dataDir: "./example/data",
  apiUrl: "http://zapant.com/api",
  backtest: {
    date: "2024-04-01",
    window: 10,
    analyzers: [
      new RetursAnalyzer()
    ]
  }
}

export default config;