import PropTypes from 'prop-types';
import React from 'react';

const CheckBox = ({ checked, value, onChange }) => (
  <input
    type="checkbox"
    checked={checked}
    value={value}
    onChange={onChange}
    style={{ width: '8px' }}
  />
);

CheckBox.defaultProps = {
  checked: false,
};

CheckBox.propTypes = {
  onChange: PropTypes.func.isRequired,
  checked: PropTypes.bool,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};


export default CheckBox;
