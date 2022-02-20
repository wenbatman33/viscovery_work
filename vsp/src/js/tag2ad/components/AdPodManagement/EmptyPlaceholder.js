import React from 'react';
import PropTypes from 'prop-types';

const divStyle = {
  color: 'rgba(26, 10, 10, 0.9)',
  marginTop: '146px',
  textAlign: 'center',
  padding: '0 24px',
};

const EmptyPlaceholder = props => (
  <h2 style={divStyle}>
    <i className="fa fa-arrow-left" aria-hidden="true" />
    {props.placeholder}
  </h2>
);


EmptyPlaceholder.propTypes = {
  placeholder: PropTypes.string,
};


export default EmptyPlaceholder;
