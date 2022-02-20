import PropTypes from 'prop-types';
import React from 'react';

const PlayButton = ({ onClick }) => (
  <div
    style={{
      width: '10%',
    }}
    onClick={onClick}
  >
    <svg viewBox="0 0 1 1">
      <polygon points="0,0 1,0.5 0,1" />
    </svg>
  </div>
);

PlayButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default PlayButton;
