import React from 'react';
import PropTypes from 'prop-types';

import { Checkbox } from 'vidya/Form';

const OptionElement = ({ onChange, checked, id, labelText }) => (
  <div
    style={{
      display: 'flex',
    }}
  >
    <Checkbox
      id={id}
      checked={checked}
      onChange={onChange}
      style={{
        marginRight: '6px',
      }}
    />
    <label
      htmlFor={id}
      style={{
        cursor: 'pointer',
      }}
    >
      {labelText}
    </label>
  </div>
);

OptionElement.propTypes = {
  onChange: PropTypes.func,
  labelText: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  checked: PropTypes.bool,
  id: PropTypes.string,
};

export default OptionElement;
