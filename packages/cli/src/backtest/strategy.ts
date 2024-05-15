import { type Api } from '@/api'
import { Env, evalCode } from 'zplang'
import Broker from "./broker"
import { threadId } from 'node:worker_threads'

class Strategy {
  code: string
  broker: Broker
  env: Env
  analyzers: any[] = []

  constructor({ code }) {
    this.code = code
    this.broker = new Broker()
    this.env = new Env({})
  }

  addAnalyzer (analyzer) {
    this.analyzers.push(analyzer)
  }

  getAnalyzer (name: string) {
    return this.analyzers.find(a => a.name === name)
  }

  start () {
    this.broker.setCash(10_000)
    this.broker.setCommision(0.00)

    this.analyzers.forEach(analyzer => analyzer.start?.({ strategy: this}))
  }

  end () {
    this.broker.closeAllPositions()
    this.analyzers.forEach(analyzer => analyzer.end?.({ strategy: this}))
  }

  prenext (context) {
    const { bars, code, date, barIndex } = context

    // set data to broker
    this.broker.setData(bars)

    // set env
    this.env.loadBars(bars)
    this.env.call('setCash', this.broker.getCash())
    this.env.call('setPositions', this.broker.getOpenPositions())
    this.env.call('setOrders', [])
  }

  next (context) {
    const { bars, code, date, barIndex } = context

    // run zp code
    const { orders, stdout } = this.runCode(code)

    // execute orders
    const executedOrders = this.broker.fillOrders(orders)

    if (stdout) {
      console.log(stdout)
    }

    this.analyzers.forEach(analyzer => analyzer.next?.({ strategy: this, ...context, orders: executedOrders }))

    return executedOrders
  }

  runCode = (code: string) => {
    const start = performance.now()

    const result = evalCode(this.env, code)
    const stop = performance.now()
    const inSeconds = (stop - start) / 1000

    return {
      orders: this.env.call('getOrders'),
      result,
      stdout: this.env.stdout,
      time: inSeconds
    }
  }
}

export default Strategy