import React from "react"
import ReactApexChart from "react-apexcharts"

class LineChart extends React.Component {
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
      <ReactApexChart
        options={(this.state as any).chartOptions}
        series={(this.state as any).chartData}
        type="area"
        width="100%"
        height="100%"
      />
    )
  }
}

export default LineChart
