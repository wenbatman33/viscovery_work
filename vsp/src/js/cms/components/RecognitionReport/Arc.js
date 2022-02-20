import PropTypes from 'prop-types';
import React from 'react';
import { arc } from 'd3-shape';

const d3 = { arc };

class Arc extends React.Component {

  handleMouseEnter = () => {
    const { startAngle, endAngle } = this.props;
    if (this.props.onMouseEnter) {
      const percentage = ((endAngle - startAngle) * 100) / (2 * Math.PI);
      this.props.onMouseEnter(this.props.label, this.props.value, percentage);
    }
  };

  handleMouseLeave = () => {
    if (this.props.onMouseLeave) {
      this.props.onMouseLeave();
    }
  };


  render() {
    const { startAngle, endAngle, innerRadius, outerRadius, fill, stroke } = this.props;

    const render = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .startAngle(startAngle)
      .endAngle(endAngle);

    return (
      <path
        d={render()}
        fill={fill}
        stroke={stroke}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      />
    );
  }
}

Arc.defaultProps = {
  labelTextFill: 'black',
  valueTextFill: 'white',
  fill: 'blue',
};
Arc.propTypes = {
  fill: PropTypes.string,
  startAngle: PropTypes.number.isRequired,
  endAngle: PropTypes.number.isRequired,
  innerRadius: PropTypes.number.isRequired,
  outerRadius: PropTypes.number.isRequired,
  stroke: PropTypes.string,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
};

export default Arc;
