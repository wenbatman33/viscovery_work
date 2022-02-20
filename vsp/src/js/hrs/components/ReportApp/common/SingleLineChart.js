import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';

import * as d3Shape from 'd3-shape';
import * as d3Scale from 'd3-scale';
import * as d3Axis from 'd3-axis';
import * as d3Select from 'd3-selection';

import R from 'ramda';
import moment from 'moment';
import humanize from 'humanize';

import { getDomainLevel, dateTickFormat } from '../utils';
import styles from './SingleLineChart.scss';

const maxArray = arr => Math.max(...arr);

const xScale = gWidth => rangeTime =>
  d3Scale.scaleBand()
    .rangeRound([0, gWidth])
    .paddingOuter(0.5)
    .paddingInner(1)
    .domain(rangeTime);

const yScale = gHeight => maxValue =>
  d3Scale.scaleLinear()
    .rangeRound([gHeight, 0])
    .domain([0, maxValue]);

const removeChart = el =>
  d3Select.select(el)
    .selectAll('*')
    .remove();

let fontSize;

class SingleLineChart extends React.PureComponent {
  constructor(props) {
    super(props);

    this.getWidthAndHeight = this.getWidthAndHeight.bind(this);
    this.renderXAxis = this.renderXAxis.bind(this);
    this.renderYAxis = this.renderYAxis.bind(this);
    this.renderLineChart = this.renderLineChart.bind(this);
    this.renderChart = this.renderChart.bind(this);
    this.getXScale = this.getXScale.bind(this);
    this.getYScale = this.getYScale.bind(this);
  }

  componentDidMount() {
    this.renderChart(this.lineChart);

    fontSize = parseInt(window.getComputedStyle(this.container).getPropertyValue('font-size'), 10);
  }

  componentDidUpdate() {
    removeChart(this.lineChart);
    this.renderChart(this.lineChart);
  }

  getXScale() {
    const {
      width,
    } = this.getWidthAndHeight();

    const {
      marginRight,
      marginLeft,
      range,
    } = this.props;

    const gWidth = width - marginLeft - marginRight;

    return xScale(gWidth)(range);
  }

  getYScale() {
    const {
      height,
    } = this.getWidthAndHeight();

    const {
      marginTop,
      marginBottom,
      data,
    } = this.props;

    const gHeight = height - marginTop - marginBottom;

    const maxValue = maxArray(R.map(ele => ele.count, data));

    return yScale(gHeight)(maxValue);
  }

  getWidthAndHeight() {
    return {
      width: this.container.getBoundingClientRect().width,
      height: this.container.getBoundingClientRect().height,
    };
  }

  renderXAxis(el) {
    const {
      height,
    } = this.getWidthAndHeight();

    const {
      marginTop,
      marginBottom,
    } = this.props;

    const gHeight = height - marginTop - marginBottom;

    const x = this.getXScale();

    const domainLevel = getDomainLevel(x.domain().length);

    const axisFunc = d3Axis.axisBottom(x)
      .tickSize(30)
      .tickSizeInner(0)
      .tickSizeOuter(0)
      .tickFormat((d, i) => dateTickFormat(d, i)(domainLevel));

    d3Select.select(el)
      .append('g')
      .attr('class', styles.axis)
      .attr('transform', `translate(0, ${gHeight})`)
      .call(axisFunc);
  }

  renderYAxis(el) {
    const y = this.getYScale();

    const axisFunc = d3Axis.axisLeft(y)
      .ticks(4);

    d3Select.select(el)
      .append('g')
      .attr('class', styles.axis)
      .call(axisFunc);
  }

  renderLineChart(el) {
    const { data } = this.props;
    const x = this.getXScale();
    const y = this.getYScale();
    const domainLevel = getDomainLevel(x.domain().length);

    const line = d3Shape.line()
    .x(d => x(d.report_time))
    .y(d => y(d.count));

    d3Select.select(el)
    .append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('class', styles.chartPath)
    .attr('d', line);

    const dots = d3Select.select(el)
      .selectAll('.dot')
      .data(data.filter(d => d.count > 0))
      .enter()
      .append('circle')
      .attr('class', styles.dot)
      .attr('cx', line.x())
      .attr('cy', line.y());

    const tooltip = d3Select.select(el)
      .append('g')
      .attr('class', styles.tooltip)
      .style('display', 'none');

    tooltip.append('rect')
      .attr('class', styles.tooltip__rect)
      .attr('width', 105)
      .attr('height', 70)
      .attr('fill', 'white');

    const text = tooltip.append('text')
      .attr('class', styles.tooltip__text)
      .attr('x', 15)
      .attr('dy', 30)
      .attr('font-size', '0.875rem')
      .attr('font-weight', 'bold');

    const renderText = (val, key) => {
      text.append('tspan')
      .attr('class', styles.tooltip__title)
      .attr('x', '10')
      .attr('dy', '1.4em')
      .text(key);

      text.append('tspan')
      .attr('x', '10')
      .attr('dy', '1.4em')
      .text(humanize.numberFormat(val, 0));
    };

    const renderDate = (time) => {
      text.append('tspan')
      .attr('x', '10')
      .attr('dy', '1.2em')
      .text(moment(time, 'YYYYMMDD').format('MM/DD'));
    };

    const checkYPosition = (mouseY) => {
      const targetY = mouseY - tooltip.select('rect').attr('height') - 20;
      return R.lt(targetY, 0) ? mouseY + 10 : targetY;
    };

    const renderCount = (d) => {
      const showDate = (domainLevel !== 'day');
      let height = (fontSize * 0.25) + ((R.keys(d.shiftCounts).length) * fontSize * 1.4 * 2);
      if (showDate) height += (fontSize * 1.2);

      text.selectAll('tspan').remove();

      if (showDate) renderDate(d.report_time);
      R.forEachObjIndexed(renderText, d.shiftCounts);
      tooltip.select('rect')
      .attr('height', height);
    };


    dots.on('mouseover', () => tooltip.style('display', null))
      .on('mouseout', () => tooltip.style('display', 'none'))
      .on('mousemove', function (d) {
        renderCount(d);
        const xPosition = d3Select.mouse(this)[0] - 10;
        const yPosition = checkYPosition(d3Select.mouse(this)[1]);
        tooltip.attr('transform', `translate(${xPosition}, ${yPosition})`);
      });
  }

  renderChart(el) {
    this.renderXAxis(el);
    this.renderYAxis(el);
    this.renderLineChart(el);
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
          ref={(node) => { this.lineChart = node; }}
          transform={`translate(${this.props.marginLeft}, ${this.props.marginTop})`}
        />
      </svg>
    );
  }
}

SingleLineChart.propTypes = {
  marginTop: PropTypes.number,
  marginRight: PropTypes.number,
  marginBottom: PropTypes.number,
  marginLeft: PropTypes.number,
  range: PropTypes.arrayOf(PropTypes.string),
  data: PropTypes.arrayOf(PropTypes.object),
  keys: PropTypes.arrayOf(PropTypes.string),
};

export default CSSModules(SingleLineChart, styles);
