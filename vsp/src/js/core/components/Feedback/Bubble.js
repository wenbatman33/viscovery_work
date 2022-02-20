import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';

import styles from './Bubble.scss';

const Bubble = ({ children }) => (
  <div styleName="container">
    <p styleName="wrap">{children}</p>
    <svg
      viewBox="0 0 10 10"
      styleName="triangleWrapper"
    >
      <polyline
        styleName="triangle"
        points="0,0 5,5 0,10"
      />
    </svg>
  </div>
);

Bubble.propTypes = {
  children: PropTypes.node,
};

export default CSSModules(Bubble, styles);
