import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import styles from './Checkbox.scss';

const Checkbox = props => (
  <div
    styleName="control checkbox"
    style={props.style || {}}
    onClick={(evt) => {
      if (!props.disabled) {
        evt.stopPropagation();
        props.onChange(!props.checked, props.value);
      }
    }}
  >
    <input
      id={props.id}
      type="checkbox"
      value={props.value}
      checked={props.checked}
      disabled={props.disabled}
      onChange={() => {}}
    />
    <div styleName="indicator" />
  </div>
);

Checkbox.defaultProps = {
  disabled: false,
};
Checkbox.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  style: PropTypes.object,
  disabled: PropTypes.bool,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};


export default CSSModules(Checkbox, styles, { allowMultiple: true });
