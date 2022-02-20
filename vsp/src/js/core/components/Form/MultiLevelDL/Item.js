import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';

import { handleIndent } from './utils';

import styles from './Item.scss';

const Item = ({ label, value, level, selectFunc, ...rest }) => (
  <div
    styleName="container"
    style={{
      textIndent: `${handleIndent(level)}px`,
    }}
    onClick={() => {
      selectFunc({
        label,
        value,
        ...rest,
      });
    }}
  >
    <p>
      {label}
    </p>
  </div>
);

Item.propTypes = {
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  level: PropTypes.number,
  selectFunc: PropTypes.func,
};

export default CSSModules(Item, styles);
