import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';

import * as d3Shape from 'd3-shape';
import * as d3Scale from 'd3-scale';
import * as d3Axis from 'd3-axis';
import * as d3Select from 'd3-selection';

import humanize from 'humanize';
import R from 'ramda';
import moment from 'moment';

import { getDomainLevel, dateTickFormat } from '../utils';
import styles from './MultiLineChart.scss';

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

const zScale = colorRange => keys =>
  d3Scale.scaleOrdinal()
    .range(colorRange)
    .domain(keys);

const modelMapping = (modelId) => {
  const mapping = {
    1: 'face',
    6: 'object',
    7: 'scene',
  };

  return mapping[modelId] || modelId;
};

const removeChart = el =>
  d3Select.select(el)
    .selectAll('*')
    .remove();

let fontSize;

class MultiLineChart extends React.PureComponent {
  constructor(props) {
    super(props);

    this.getWidthAndHeight = this.getWidthAndHeight.bind(this);
    this.renderXAxis = this.renderXAxis.bind(this);
    this.renderYAxis = this.renderYAxis.bind(this);
    this.renderLineChart = this.renderLineChart.bind(this);
    this.renderGoal = this.renderGoal.bind(this);
    this.renderChart = this.renderChart.bind(this);
    this.getXScale = this.getXScale.bind(this);
    this.getYScale = this.getYScale.bind(this);
    this.getZScale = this.getZScale.bind(this);
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
      workGoal,
    } = this.props;

    const gHeight = height - marginTop - marginBottom;

    const maxValue = maxArray(R.compose(
      R.concat([workGoal]),
      R.map(ele => ele.count),
      R.flatten,
      R.map(ele => R.values(ele.data)),
    )(data));

    return yScale(gHeight)(maxValue);
  }

  getZScale() {
    const {
      keys,
      colorRange,
    } = this.props;
    return zScale(colorRange)(keys);
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
      .call(axisFunc)
      .selectAll('.tick line');
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

  renderGoal(el) {
    const y = this.getYScale();
    const {
      width,
    } = this.getWidthAndHeight();
    const {
      marginRight,
      marginLeft,
      workGoal,
    } = this.props;
    const gWidth = width - marginLeft - marginRight;

    const defaultToZero = R.defaultTo(0);

    const goalData = [{
      data: [
        { x: 0, y: workGoal },
        { x: gWidth, y: workGoal },
      ],
    }];

    const line = d3Shape.line()
    .x(d => d.x)
    .y(d => defaultToZero(y(d.y)));

    d3Select.select(el)
    .selectAll('.goal')
    .data(goalData)
    .enter()
    .append('g')
    .attr('class', 'goal')
    .append('path')
    .attr('class', styles.goal)
    .attr('d', d => line(d.data));
  }

  renderLineChart(el) {
    const { data, keys } = this.props;
    const x = this.getXScale();
    const y = this.getYScale();
    const z = this.getZScale();
    const domainLevel = getDomainLevel(x.domain().length);

    const assigneesData = keys.map(id => ({
      id,
      values: R.map(ele => ({
        id,
        report_time: ele.report_time,
        count: ele.data[id].count,
        reports: ele.data[id].reports,
      }), data),
    }));

    const dotDatas = R.compose(
      R.filter(d => d.count > 0),
      R.flatten,
      R.map(ele => ele.values),
    )(assigneesData);

    const line = d3Shape.line()
    .x(d => x(d.report_time))
    .y(d => y(d.count));

    d3Select.select(el)
    .selectAll('.chartLine')
    .data(assigneesData)
    .enter()
    .append('g')
    .attr('class', 'chartLine')
    .append('path')
    .attr('fill', 'none')
    .attr('class', styles.chartPath)
    .attr('d', d => line(d.values))
    .style('stroke', d => z(d.id));

    const dots = d3Select.select(el)
      .selectAll('.dot')
      .data(dotDatas)
      .enter()
      .append('circle')
      .attr('class', styles.dot)
      .attr('cx', d => x(d.report_time))
      .attr('cy', d => y(d.count));

    const tooltip = d3Select.select(el)
      .append('g')
      .attr('class', styles.tooltip)
      .style('display', 'none');

    tooltip.append('rect')
      .attr('class', styles.tooltip__rect)
      .attr('width', 170)
      .attr('height', 70)
      .attr('fill', 'white');

    const text = tooltip.append('text')
      .attr('class', styles.tooltip__text)
      .attr('x', 15)
      .attr('dy', 30)
      .attr('font-size', '0.875rem')
      .attr('font-weight', 'bold');

    const renderText = (words, size = '1.2em') => {
      text.append('tspan')
      .attr('x', '10')
      .attr('dy', size)
      .text(words);
    };

    const renderDate = (time) => {
      renderText(moment(time, 'YYYYMMDD').format('MM/DD'));
    };

    const renderProperty = (val, key) => {
      const words = `${modelMapping(key)} ${humanize.numberFormat(val[0], 0)} (${val[1]}%)`;
      renderText(words);
    };

    const checkYPosition = (mouseY) => {
      const targetY = mouseY - tooltip.select('rect').attr('height') - 20;
      return R.lt(targetY, 0) ? mouseY + 10 : targetY;
    };

    const renderCount = (d) => {
      const { count, reports, report_time } = d;
      const showDate = (domainLevel !== 'day');
      let height = (fontSize * 0.25) + ((R.keys(reports).length + 1) * fontSize * 1.4);
      if (showDate) height += (fontSize * 1.2);

      text.selectAll('tspan').remove();

      if (showDate) renderDate(report_time);
      renderText(humanize.numberFormat(count, 0), '1.4em');

      const calculate = (val) => {
        const percent = (100 * (val / count)).toFixed(0);
        return [val, percent];
      };

      const calculated = R.mapObjIndexed(calculate, reports);
      R.forEachObjIndexed(renderProperty, calculated);


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
    this.renderGoal(el);
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

MultiLineChart.propTypes = {
  marginTop: PropTypes.number,
  marginRight: PropTypes.number,
  marginBottom: PropTypes.number,
  marginLeft: PropTypes.number,
  workGoal: PropTypes.number,
  colorRange: PropTypes.arrayOf(PropTypes.string),
  range: PropTypes.arrayOf(PropTypes.string),
  data: PropTypes.arrayOf(PropTypes.object),
  keys: PropTypes.arrayOf(PropTypes.string),
};

export default CSSModules(MultiLineChart, styles);
