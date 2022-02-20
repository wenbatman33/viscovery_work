import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';

import * as d3Shape from 'd3-shape';
import * as d3Scale from 'd3-scale';
import * as d3Axis from 'd3-axis';
import * as d3Select from 'd3-selection';

import R from 'ramda';
import styles from './StackedBarChart.scss';

const maxArray = arr => Math.max(...arr);

const xScale = gWidth => itemNames =>
  d3Scale.scaleBand()
    .rangeRound([0, gWidth])
    .paddingOuter(0.1)
    .paddingInner(0.9)
    .domain(itemNames);

const yScale = gHeight => maxValue =>
  d3Scale.scaleLinear()
    .rangeRound([gHeight, 0])
    .domain([0, maxValue]);

const zScale = colorRange => keys =>
  d3Scale.scaleOrdinal()
    .range(colorRange)
    .domain(keys);

const removeChart = el =>
  d3Select.select(el)
    .selectAll('*')
    .remove();

const modelMapping = (modelId) => {
  const mapping = {
    1: 'Face',
    6: 'Object',
    7: 'Scene',
  };

  return mapping[modelId] || modelId;
};

class StackedBarChart extends React.PureComponent {
  constructor(props) {
    super(props);

    this.getWidthAndHeight = this.getWidthAndHeight.bind(this);
    this.renderXAxis = this.renderXAxis.bind(this);
    this.renderYAxis = this.renderYAxis.bind(this);
    this.renderGoal = this.renderGoal.bind(this);
    this.renderBarChart = this.renderBarChart.bind(this);
    this.renderChart = this.renderChart.bind(this);
    this.getXScale = this.getXScale.bind(this);
    this.getYScale = this.getYScale.bind(this);
    this.getZScale = this.getZScale.bind(this);
    this.getSeries = this.getSeries.bind(this);
  }

  componentDidMount() {
    this.renderChart(this.barChart);
  }

  componentDidUpdate() {
    removeChart(this.barChart);
    this.renderChart(this.barChart);
  }

  getXScale() {
    const {
      width,
    } = this.getWidthAndHeight();

    const {
      marginRight,
      marginLeft,
      data,
    } = this.props;

    const gWidth = width - marginLeft - marginRight;
    const itemNames = data.map(ele => ele.username);

    return xScale(gWidth)(itemNames);
  }

  getYScale() {
    const {
      height,
    } = this.getWidthAndHeight();

    const {
      marginTop,
      marginBottom,
    } = this.props;

    const gHeight = height - marginTop - marginBottom;

    const series = this.getSeries();
    const maxValue = maxArray(series.map(arr => arr.map(maxArray)).map(maxArray));

    return yScale(gHeight)(maxValue);
  }

  getZScale() {
    const {
      keys,
    } = this.props;

    return zScale(['#17BCAB', '#66F2E3', '#66D6F2'])(keys);
  }

  getSeries() {
    const {
      keys,
      data,
    } = this.props;

    const stack = d3Shape.stack()
      .keys(keys)
      .order(d3Shape.stackOrderNone)
      .offset(d3Shape.stackOffsetNone);

    return stack(data);
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
    const axisFunc = d3Axis.axisBottom(x)
      .tickSize(30)
      .tickSizeInner(10)
      .tickSizeOuter(0);

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

  renderBarChart(el) {
    const x = this.getXScale();
    const y = this.getYScale();
    const z = this.getZScale();
    const series = this.getSeries();

    const rects = d3Select.select(el)
      .append('g')
      .selectAll('g')
      .data(series)
      .enter()
      .append('g')
      .attr('fill', d => z(d.key))
      .selectAll('rect')
      .data((d) => {
        const key = d.key;
        const result = d.map(e => (
          {
            ...e,
            key,
          }
        ));
        return result;
      })
      .enter()
      .append('rect')
      .attr('x', d => x(d.data.username))
      .attr('y', d => y(d[1]))
      .attr('height', d => y(d[0]) - y(d[1]))
      .attr('width', x.bandwidth());

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

    const modelText = text.append('tspan')
      .attr('class', styles.tooltip__title)
      .attr('x', '10')
      .attr('dy', '1.4em');
    const modelCount = text.append('tspan')
      .attr('x', '10')
      .attr('dy', '1.4em');

    const checkYPosition = (mouseY) => {
      const targetY = mouseY - tooltip.select('rect').attr('height') - 10;
      return R.lt(targetY, 0) ? mouseY + 10 : targetY;
    };


    rects.on('mouseover', () => tooltip.style('display', null))
      .on('mouseout', () => tooltip.style('display', 'none'))
      .on('mousemove', function (d) {
        const xPosition = d3Select.mouse(this)[0] - 10;
        const yPosition = checkYPosition(d3Select.mouse(this)[1]);
        tooltip.attr('transform', `translate(${xPosition}, ${yPosition})`);

        modelText.text(modelMapping(d.key));
        modelCount.text(d[1] - d[0]);
      });
  }

  renderChart(el) {
    this.renderXAxis(el);
    this.renderYAxis(el);
    this.renderGoal(el);
    this.renderBarChart(el);
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

StackedBarChart.propTypes = {
  marginTop: PropTypes.number,
  marginRight: PropTypes.number,
  marginBottom: PropTypes.number,
  marginLeft: PropTypes.number,
  workGoal: PropTypes.number,
  data: PropTypes.arrayOf(PropTypes.object),
  keys: PropTypes.arrayOf(PropTypes.string),
};

export default CSSModules(StackedBarChart, styles);
