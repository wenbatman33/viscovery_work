import PropTypes from 'prop-types';
import React from 'react';

const VolumeControl = ({ volume, onChange }) => (
  <div>
    <input
      type="range"
      min={0}
      max={1}
      step={0.01}
      onChange={e => onChange(e.target.value)}
      value={volume}
    />
  </div>
);

VolumeControl.propTypes = {
  volume: PropTypes.number.isRequired,
  onChange: PropTypes.func,
};

export default VolumeControl;
