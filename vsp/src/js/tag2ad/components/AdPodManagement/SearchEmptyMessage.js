import React from 'react';
import PropTypes from 'prop-types';

const divStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginTop: '120px',
  width: '100%',
  padding: '0 10%',
  lineHeight: '200%',
  fontSize: '18px',
};

const SearchEmptyMessage = props => (
  <div style={divStyle}>
    <div>{props.message1}</div>
    <div>{props.message2}</div>
  </div>
);

SearchEmptyMessage.propTypes = {
  message1: PropTypes.string.isRequired,
  message2: PropTypes.string.isRequired,
};


export default SearchEmptyMessage;
