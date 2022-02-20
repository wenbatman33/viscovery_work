import PropTypes from 'prop-types';
import React from 'react';

const FAIcon = ({ children, faClassName, style, className, onClick }) => (
  <i
    className={`fa ${faClassName} ${className}`}
    style={style}
    onClick={onClick}
  >
    {children}
  </i>
);

FAIcon.propTypes = {
  children: PropTypes.node,
  faClassName: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default FAIcon;
