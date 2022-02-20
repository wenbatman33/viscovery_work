import React, { PropTypes } from 'react';

import CSSModules from 'react-css-modules';

import styles from './SelectableItem.scss';

const propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  onClick: PropTypes.func.isRequired,
};

const SelectableItem = ({ label, value, onClick }) => (
  <div styleName="item" onClick={() => onClick(value)}>
    {label}
  </div>
);

SelectableItem.propTypes = propTypes;

export default CSSModules(SelectableItem, styles);
