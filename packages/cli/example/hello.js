const assets = ["AAPL", "MSFT"]
const window = 10
const settings = {}

function run() {
  let close5 = this.assets("AAPL", 5, { prop: 'close', daysAgo: 0 })

  this.print(close5)

  let sma5 = this.ema(5, "AAPL")
  this.print(`AAPL sma => ${sma5}`)

  // for (const symbol of assets) {
  //   this.buy(this.asset(symbol), 1)
  // }

}

return { assets, window, run }