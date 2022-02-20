import React from 'react';
import PropTypes from 'prop-types';

export const divStyle = {
  color: 'rgba(26, 10, 10, 0.5)',
  fontSize: '14px',
};

class GeneralCardPlaceholder extends React.PureComponent {


  render() {
    return (
      <div
        style={divStyle}
      >
        {this.props.text}
      </div>
    );
  }
}

GeneralCardPlaceholder.propTypes = {
  text: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};

export default GeneralCardPlaceholder;
