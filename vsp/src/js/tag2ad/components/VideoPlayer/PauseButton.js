import PropTypes from 'prop-types';
import React from 'react';

const PauseButton = ({ onClick }) => (
  <div
    style={{
      width: '10%',
    }}
    onClick={onClick}
  >
    <svg viewBox="0 0 30 30">
      <g>
        <line x1="5" y1="0" x2="5" y2="30" strokeWidth="5" stroke="black" />
        <line x1="25" y1="0" x2="25" y2="30" strokeWidth="5" stroke="black" />
      </g>
    </svg>
  </div>
);

PauseButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default PauseButton;
