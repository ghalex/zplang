const assets = ["AAPL", "MSFT"]
const window = 1
const settings = {}

function run() {
  this.sma(14, "AAPL", { roll: 2, prop: "close" })

  for (const symbol of assets) {
    this.buy(this.asset(symbol), 1)
  }

  this.print(this.getOrders())
}

return { assets, window, run }