import PropTypes from 'prop-types';
import React from 'react';

const CurrentDisplay = ({ currentTime, duration }) => (
  <div>
    {`${Math.floor(currentTime)}/${Math.floor(duration)}`}
  </div>
);

CurrentDisplay.propTypes = {
  currentTime: PropTypes.number.isRequired,
  duration: PropTypes.number,
};

export default CurrentDisplay;
