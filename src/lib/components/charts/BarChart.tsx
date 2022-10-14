import React, {Component} from "react"
import Chart from "react-apexcharts"

class BarChart extends Component {
  constructor(props) {
    super(props)
    this.state = {
      chartData: [],
      chartOptions: {}
    }
  }

  componentDidMount() {
    this.setState({
      chartData: (this.props as any).chartData,
      chartOptions: (this.props as any).chartOptions
    })
  }

  render() {
    return (
      <Chart
        options={(this.state as any).chartOptions}
        series={(this.state as any).chartData}
        type="bar"
        width="100%"
        height="100%"
      />
    )
  }
}

export default BarChart
