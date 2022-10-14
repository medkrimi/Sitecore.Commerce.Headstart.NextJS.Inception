import React, {Component} from "react"
import Chart from "react-apexcharts"

class LineBarChart extends Component {
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
        type="line"
        width="100%"
        height="100%"
      />
    )
  }
}

export default LineBarChart
