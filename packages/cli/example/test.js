const assets = ["AAPL", "MSFT"]
const window = 5
const settings = {}


function run() {
  this.sma(5, "AAPL")

  for (const symbol of assets) {
    if (this.barIndex < 3) {
      this.buy(this.asset(symbol), 1)
    }
  }

  // const AAPL = this.asset("AAPL")

  this.print(this.barIndex)
  this.print(this.date)
  this.print(this.getCash())
  this.print(this.getTotalCapital())
}

return { assets, window, run }