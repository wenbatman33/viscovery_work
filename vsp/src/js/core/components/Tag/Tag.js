import React, { PropTypes } from 'react';

import CSSModules from 'react-css-modules';

import styles from './Tag.scss';

const Tag = ({ label, value, onDelete }) => (
  <span styleName="tag">
    {label}
    <i className="fa fa-times" onClick={() => { onDelete(value); }} />
  </span>
);

Tag.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  onDelete: PropTypes.func,
};

Tag.defaultProps = {
  onDelete: () => {},
};

export default CSSModules(Tag, styles);
