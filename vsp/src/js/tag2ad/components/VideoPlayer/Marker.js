import PropTypes from 'prop-types';
import React from 'react';

const Marker = ({ location, onClick }) => (
  <div
    style={{
      position: 'absolute',
      width: '10px',
      height: '10px',
      borderRadius: '10px',
      backgroundColor: 'rgb(198, 58, 39)',
      left: `${location}%`,
      transform: 'translateX(-5px)',
    }}
    onClick={onClick}
  />
);

Marker.propTypes = {
  location: PropTypes.number.isRequired,
  onClick: PropTypes.func,
};

export default Marker;
