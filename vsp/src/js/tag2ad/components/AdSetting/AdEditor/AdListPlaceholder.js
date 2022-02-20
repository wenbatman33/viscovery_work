import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import styles from './AdListPlaceholder.scss';

const AdListPlaceholder = props => (
  <div styleName={'container'}>
    {props.children}
  </div>
);

AdListPlaceholder.propTypes = {
  children: PropTypes.node,
};


export default CSSModules(AdListPlaceholder, styles);
