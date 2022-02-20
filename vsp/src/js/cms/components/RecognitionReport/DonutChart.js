import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import { translate } from 'react-i18next';
import { pie } from 'd3-shape';

import Arc from './Arc';
import { DONUT_COLORS, NAME } from '../../constants';

import styles from './styles.scss';

class DonutChart extends React.Component {
  state = {
    title: null,
    value: null,
    percentage: null,
  };

  genArcsComponents = () => {
    const { innerRadius, outerRadius, colors } = this.props;
    const arcs = [];

    const arcsData = pie().value(d => d.value)(this.props.data);

    arcsData.forEach((d, index) => {
      arcs.push(
        <Arc
          key={d.data.label}
          label={d.data.label}
          value={d.value}
          innerRadius={innerRadius}
          outerRadius={d.data.label === this.state.title ? outerRadius + 10 : outerRadius}
          startAngle={d.startAngle}
          endAngle={d.endAngle}
          fill={colors[(index + 1) % colors.length]}
          onMouseEnter={this.handleArcMouseEnter}
          onMouseLeave={this.handleArcMouseLeave}
        />
      );
    });

    return arcs;
  };

  handleArcMouseEnter = (label, value, percentage) => {
    const dispPercentage = percentage < 1 ? '< 1' : Math.round(percentage);
    this.setState({
      title: label,
      value,
      percentage: dispPercentage,
    });
  };

  handleArcMouseLeave = () => {
    this.clearText();
  };

  clearText = () => {
    this.setState({
      title: null,
      value: null,
      percentage: null,
    });
  };

  render() {
    const { outerRadius, t } = this.props;
    const { title, value, percentage } = this.state;
    const svgWidth = outerRadius * 2.5;
    const svgHeight = outerRadius * 2.5;
    return (
      <div >
        <svg style={{ width: `${svgWidth}px`, height: `${svgHeight}px` }}>
          <g style={{ transform: `translate(${svgWidth / 2}px,${svgHeight / 2}px)` }}>
            {this.genArcsComponents()}
            <text
              y="-20"
              styleName="donut-title"
            >
              {title}
            </text>
            <text
              y="5"
              styleName="donut-text"
            >
              {percentage ? `${percentage}%` : ''}
            </text>

            <text
              y="30"
              styleName="donut-text"
            >
              {value
                ? t('tagsCount', { count: value })
                : null
              }
            </text>
          </g>
        </svg>
      </div>
    );
  }
}

DonutChart.defaultProps = {
  innerRadius: 90,
  outerRadius: 130,
  svgWidth: 250,
  svgHeight: 190,
  colors: DONUT_COLORS,
};
DonutChart.propTypes = {
  t: PropTypes.func.isRequired,
  innerRadius: PropTypes.number.isRequired,
  outerRadius: PropTypes.number.isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.number,
  })).isRequired,
  colors: PropTypes.arrayOf(PropTypes.string),
};

export default translate([NAME])(CSSModules(DonutChart, styles));
