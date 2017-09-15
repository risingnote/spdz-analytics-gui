/**
 * Display the results from the percentHour analytic function.
 * Very specifc to the cyber incidents query. 
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import styled from 'styled-components'
import { Bar } from 'react-chartjs-2'

/* Needed to constrain canvas. */
const SizeDiv = styled.div`height: 250px;`

const HeadingLayout = styled.div`padding-bottom: 10px;`

class PercentHistogram extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.data !== this.props.data
  }

  render() {
    const xLabels = {
      labels: [
        '00',
        '01',
        '02',
        '03',
        '04',
        '05',
        '06',
        '07',
        '08',
        '09',
        '10',
        '11',
        '12',
        '13',
        '14',
        '15',
        '16',
        '17',
        '18',
        '19',
        '20',
        '21',
        '22',
        '23'
      ]
    }

    const datasets = data => {
      const dataset = {
        label: '% of cyber incidents by hour',
        backgroundColor: 'rgba(255,99,132,0.2)',
        borderColor: 'rgba(255,99,132,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
        hoverBorderColor: 'rgba(255,99,132,1)'
      }
      dataset['data'] = data
      const datasets = {}
      datasets['datasets'] = [dataset]
      return datasets
    }

    const dataConfig = data => Object.assign({}, xLabels, datasets(data))

    const constChartOptions = {
      maintainAspectRatio: false,
      layout: {
        padding: {
          top: 0,
          right: 0,
          bottom: 40,
          left: 0
        }
      },
      legend: { display: false }
    }

    const noDataChartOptions = {
      scales: {
        yAxes: [
          {
            scaleLabel: { labelString: '%', display: true },
            ticks: { suggestedMin: 0, suggestedMax: 100 }
          }
        ],
        xAxes: [
          {
            scaleLabel: { labelString: 'hour', display: true }
          }
        ]
      }
    }

    const withDataChartOptions = {
      scales: {
        yAxes: [
          {
            scaleLabel: { labelString: '%', display: true },
            ticks: { suggestedMin: 0 }
          }
        ],
        xAxes: [
          {
            scaleLabel: { labelString: 'hour', display: true }
          }
        ]
      }
    }

    const options = data => {
      if (data.length === 0) {
        return Object.assign({}, constChartOptions, noDataChartOptions)
      } else {
        return Object.assign({}, constChartOptions, withDataChartOptions)
      }
    }

    return (
      <SizeDiv>
        <HeadingLayout>
          {this.props.heading}
        </HeadingLayout>
        <Bar
          data={dataConfig(this.props.data)}
          options={options(this.props.data)}
          redraw={true}
        />
      </SizeDiv>
    )
  }
}

PercentHistogram.propTypes = {
  heading: PropTypes.element.isRequired,
  data: PropTypes.arrayOf(PropTypes.number).isRequired
}

export default PercentHistogram
