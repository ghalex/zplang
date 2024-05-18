import { Env, evalCode } from 'zplang'
import { createJsEnv } from 'zptrade'
import Broker from "./Broker"

class Strategy {
  code: string
  lang: string
  barIndex: number = 0
  broker: Broker
  bars: Record<string, any[]> = {}
  env: any | null = null
  analyzers: any[] = []
  startTime: number = 0
  endTime: number = 0

  constructor({ code, lang }) {
    this.code = code
    this.lang = lang
    this.broker = new Broker()
    this.broker.eventHandler = this
    
  }

  get currentBar () {
    return this.barIndex
  }

  get currentDate () {
    return Object.values(this.bars)[0][0].dateFormatted
  }

  get duration () {
    const inSeconds = (this.endTime - this.startTime) / 1000
    return inSeconds
  }

  setBars (bars) {
    this.bars = bars
  }

  setBarIndex (index) {
    this.barIndex = index
  }

  addAnalyzer (analyzer) {
    this.analyzers.push(analyzer)
  }

  addAnalyzers (analyzers) {
    this.analyzers = this.analyzers.concat(analyzers)
  }

  getAnalyzer (name: string) {
    return this.analyzers.find(a => a.name === name)
  }

  start () {
    this.broker.setCash(10_000)
    this.broker.setCommision(0.00)

    this.analyzers.forEach(analyzer => analyzer.start?.({ strategy: this}))
    this.startTime = performance.now()
  }

  end () {
    this.broker.closeAllPositions()
    this.analyzers.forEach(analyzer => analyzer.end?.({ strategy: this}))
    this.endTime = performance.now()
  }

  createEnv () {
    switch (this.lang) {
      case 'js':
        this.env = createJsEnv(this.bars)
        this.env.barIndex = this.barIndex

        this.env.setCash(this.broker.getCash())
        this.env.setPositions(this.broker.getOpenPositions())
        this.env.setOrders([])
        break

      case 'zp':
        this.env = new Env({ bars: this.bars})

        this.env.bind('barIndex', this.barIndex)
        this.env.call('setCash', this.broker.getCash())
        this.env.call('setPositions', this.broker.getOpenPositions())
        this.env.call('setOrders', [])
        break

      default:
        throw new Error('Invalid language')
    }
    
  }

  prenext (context) {
    const { code, date } = context

    // set data to broker
    this.broker.setBarIndex(this.barIndex)
    this.broker.setBars(this.bars)

    // set env
    this.createEnv()

    // update time
    this.endTime = performance.now()
  }

  next (context) {
    const { code, date } = context

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

  private runZpCode (code: string) {
    if (!this.env) {
      throw new Error('Env is not created')
    }

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

  private runJsCode (code: string) {
    if (!this.env) {
      throw new Error('Env is not created')
    }

    const start = performance.now()

    const execFunc = new Function(code)
    const { run } = execFunc()

    // run code here
    const result = run.call(this.env)

    const stop = performance.now()
    const inSeconds = (stop - start) / 1000

    return {
      orders: this.env.getOrders(),
      result,
      stdout: this.env.stdout.join('\n'),
      time: inSeconds
    }
  }

  private runCode (code: string) {
    switch (this.lang) {
      case 'js':
        return this.runJsCode(code)

      case 'zp':
        return this.runZpCode(code)

      default:
        throw new Error('Invalid file extension. It should be .js or .zp')
    }
  }

  public onOrder (order) {
    this.analyzers.forEach(analyzer => analyzer.onOrder?.({ strategy: this, order }))
  }

  public onPosition (position) {
    this.analyzers.forEach(analyzer => analyzer.onPosition?.({ strategy: this, position }))
  }
}

export default Strategy