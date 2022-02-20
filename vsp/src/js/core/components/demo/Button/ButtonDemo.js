import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';

import { Button } from 'vidya/Button';

import styles from './ButtonDemo.scss';

const ButtonDemo = ({ size, buttonStyles }) => (
  <div
    styleName="container"
  >
    <strong>{`${size} Button`}</strong>
    {
      buttonStyles.map((style, index) => (
        <Button
          vdStyle={style === 'disable' ? undefined : style}
          vdSize={size}
          key={index}
          disable={style === 'disable'}
        >
          {size === 'icon' ? '∅' : style}
        </Button>
      ))
    }
  </div>
);

ButtonDemo.propTypes = {
  size: PropTypes.string,
  buttonStyles: PropTypes.arrayOf(
    PropTypes.string,
  ),
};

export default CSSModules(ButtonDemo, styles);
