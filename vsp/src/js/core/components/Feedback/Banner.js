import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';

import styles from './Banner.scss';

const Banner = ({ children, vdStyle }) => (
  <div styleName={vdStyle ? 'valid-container' : 'invalid-container'}>
    <i styleName="icon" className={!vdStyle ? 'fa fa-exclamation-circle' : 'fa fa-check-circle'} aria-hidden="true" />
    <p styleName="text">{children}</p>
  </div>
);

Banner.propTypes = {
  children: PropTypes.node,
  vdStyle: PropTypes.bool,
};

Banner.defaultProps = {
  vdStyle: false,
};

export default CSSModules(Banner, styles);
