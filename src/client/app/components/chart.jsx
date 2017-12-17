const React = require('react')

class Chart extends React.Component {
  componentDidMount() {
    const ChartJs = require('chart.js'); //including here because it won't run on server due to 'window' references
    const colors = [
      '#96ceb4',
      '#ffeead',
      '#ff6f69',
      '#ffcc5c',
      '#88d8b0',
      '#d11141',
      '#00b159',
      '#00aedb',
      '#f37735',
      '#ffc425'
    ]
    const adza = this.props.valsi.adza
    let labels = []
    let data = []
    for (let i of adza){
      labels.push(i.option)
      data.push(i.votes)
    }
    const data = {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: colors
        }
      ]
    }
    const ctx = document.getElementById("myChart")
    const myDoughnutChart = new ChartJs(ctx, {
      type: 'horizontalBar',
      data: data,
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [
            {
              ticks: {
                min: 0,
                stepSize: 1.0
              }
            }
          ]
        }
      }
    })
  }
  render() {
    return (
      <div className="chart-container">
        <canvas id="myChart" style={{
          width: 100,
          height: 30
        }}></canvas>
      </div>
    )
  }
}

module.exports = Chart
