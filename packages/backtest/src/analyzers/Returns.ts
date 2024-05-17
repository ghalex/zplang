import dayjs from 'dayjs'

class RetursAnalyzer {
  name = 'returns'
  data = {
    cash: {},
    value: {},
    pl: {}
  }

  next({ strategy }) {
    const date = dayjs(strategy.currentDate).format('YYYY-MM-DD')

    this.data.value[date] = strategy.broker.getValue()
    this.data.cash[date] = strategy.broker.getCash()
    this.data.pl[date] = strategy.broker.getPL()
  }

  end({ strategy }) {
    const date = dayjs(strategy.currentDate).format('YYYY-MM-DD')

    this.data.value[date] = strategy.broker.getValue()
    this.data.cash[date] = strategy.broker.getCash()
    this.data.pl[date] = strategy.broker.getPL()
  }
}

export default RetursAnalyzer