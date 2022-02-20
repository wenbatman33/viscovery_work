import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';

import { toGray } from '../../../utils/classNameUtil';

import styles from './TextInput.scss';

const TextInput = ({
  value,
  defaultValue,
  placeholder,
  onChange,
  onBlur,
  onKeyPress,
  invalid,
  invalidMessage,
  gray,
  password,
  readOnly,
  id,
  }) => {
  const props = {};

  if (value !== undefined) {
    props.value = value;
  }

  if (defaultValue !== undefined) {
    props.defaultValue = defaultValue;
  }

  return (
    <div styleName="container">
      <input
        styleName={invalid ? toGray(gray)('invalid') : toGray(gray)('input')}
        {...props}
        id={id}
        placeholder={placeholder}
        onBlur={onBlur}
        onKeyPress={onKeyPress}
        onChange={(e) => {
          if (!readOnly) {
            onChange(e.target.value);
          }
        }}
        type={password ? 'password' : 'text'}
        readOnly={readOnly}
      />
      <div styleName={invalid && invalidMessage ? 'invalidMessage' : 'hidden'}>{invalidMessage}</div>
    </div>
  );
};

TextInput.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  defaultValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  placeholder: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  onChange: PropTypes.func,
  onKeyPress: PropTypes.func,
  onBlur: PropTypes.func,
  invalid: PropTypes.bool,
  invalidMessage: PropTypes.string,
  gray: PropTypes.bool,
  password: PropTypes.bool,
  readOnly: PropTypes.bool,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

TextInput.defaultProps = {
  value: '',
  placeholder: '',
  invalid: false,
  invalidMessage: 'invalid!',
  gray: false,
  password: false,
  readOnly: false,
};

export default CSSModules(TextInput, styles);
