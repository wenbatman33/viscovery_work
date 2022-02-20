import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';

import styles from './Switch.scss';

const makeId = (length = 5) => (
  Math.random().toString(36).substring(2, length)
);

const Switch = ({ checked, onChange }) => {
  const id = makeId();
  return (
    <label
      htmlFor={id}
      styleName="label"
    >
      <input
        styleName="input"
        hidden
        type="checkbox"
        onChange={(e) => {
          onChange(e.target.checked);
        }}
        checked={checked}
        id={id}
      />
      <div
        styleName="switch"
      >
        <div styleName="round" />
      </div>
    </label>
  );
};

Switch.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func,
};

Switch.defaultProps = {
  checked: true,
};

export default CSSModules(Switch, styles);
