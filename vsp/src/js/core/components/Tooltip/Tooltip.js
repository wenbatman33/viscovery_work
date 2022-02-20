import React from 'react';

import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';

import styles from './Tooltip.scss';

const Tooltip = ({ children }) => (
  <div styleName="container">
    <div styleName="triangle" />
    <div styleName="box">
      {children}
    </div>
  </div>
);

Tooltip.propTypes = {
  children: PropTypes.node,
};

export default CSSModules(Tooltip, styles);
