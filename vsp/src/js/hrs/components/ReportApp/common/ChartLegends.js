import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';

import * as d3Scale from 'd3-scale';
import * as d3Select from 'd3-selection';

import R from 'ramda';
import styles from './MultiLineChart.scss';

const zScale = colorRange => keys =>
  d3Scale.scaleOrdinal()
    .range(colorRange)
    .domain(keys);

const removeChart = el =>
  d3Select.select(el)
    .selectAll('*')
    .remove();

const getPosition = gHeight => (i) => {
  let x;
  let y;
  if ((i * 25) + 25 > gHeight) {
    y = (i * 25) - gHeight - 25;
    x = 115;
  } else {
    y = i * 25;
    x = 5;
  }
  return { x, y };
};

class MultiLineChart extends React.PureComponent {
  constructor(props) {
    super(props);

    this.getWidthAndHeight = this.getWidthAndHeight.bind(this);
    this.renderChart = this.renderChart.bind(this);
    this.getZScale = this.getZScale.bind(this);
  }

  componentDidMount() {
    this.renderChart(this.barChart);
  }

  componentDidUpdate() {
    removeChart(this.barChart);
    this.renderChart(this.barChart);
  }

  getZScale() {
    const {
      dataNames,
      colorRange,
    } = this.props;
    return zScale(colorRange)(R.keys(dataNames));
  }

  getWidthAndHeight() {
    return {
      width: this.container.getBoundingClientRect().width,
      height: this.container.getBoundingClientRect().height,
    };
  }

  renderLegend(el) {
    const { dataNames, marginTop, marginBottom } = this.props;
    const z = this.getZScale();
    const {
      height,
    } = this.getWidthAndHeight();
    const gHeight = height - marginTop - marginBottom;

    const legendData = R.compose(
      R.map(ele => ({
        id: ele[0],
        name: ele[1],
      })),
      R.toPairs,
    )(dataNames);
    R.toPairs(dataNames);

    const series = d3Select.select(el)
    .selectAll('.series')
    .data(legendData);

    const seriesEnter = series
    .enter()
    .append('g')
    .attr('class', 'series');

    seriesEnter
    .append('circle')
    .style('fill', d => z(d.id))
    .style('stroke', d => z(d.id))
    .attr('r', 5);

    seriesEnter.append('text')
    .text(d => d.name)
    .attr('text-anchor', 'start')
    .attr('dy', '.32em')
    .attr('dx', '10');

    d3Select.select(el)
    .selectAll('.series')
    .attr('transform', (d, i) => {
      const pos = getPosition(gHeight)(i);
      return `translate(${pos.x}, ${pos.y})`;
    });
  }

  renderChart(el) {
    this.renderLegend(el);
  }

  render() {
    return (
      <svg
        ref={(node) => { this.container = node; }}
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        <g
          ref={(node) => { this.barChart = node; }}
          transform={`translate(${this.props.marginLeft}, ${this.props.marginTop})`}
        />
      </svg>
    );
  }
}

MultiLineChart.propTypes = {
  marginTop: PropTypes.number,
  marginRight: PropTypes.number,
  marginBottom: PropTypes.number,
  marginLeft: PropTypes.number,
  colorRange: PropTypes.arrayOf(PropTypes.string),
  dataNames: PropTypes.object,
};

export default CSSModules(MultiLineChart, styles);
