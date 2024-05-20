import dayjs from 'dayjs'

class PositionsAnalyzer {
  name = 'positions'
  data = []

  end({ strategy }) {
    this.data = strategy.broker.getPositions()
  }
}

export default PositionsAnalyzer