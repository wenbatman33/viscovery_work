import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';

import styles from './styles.scss';

const Bubble = ({ children }) => (
  <div styleName="container">
    <p>{children}</p>
    <svg
      viewBox="0 0 10 10"
      styleName="triangleWrapper"
    >
      <polyline
        styleName="triangle"
        points="0,5 5,0 10,5"
      />
    </svg>
  </div>
);

Bubble.propTypes = {
  children: PropTypes.node,
};

export default CSSModules(Bubble, styles);
