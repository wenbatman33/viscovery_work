import React from 'react';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';
import styles from './CustomFilterGroupLabel.scss';

const CustomFilterGroupLabel = props => (
  <div styleName="label">
    {props.children}
  </div>
);

CustomFilterGroupLabel.propTypes = {
  children: PropTypes.node,
};


export default CSSModules(CustomFilterGroupLabel, styles);
