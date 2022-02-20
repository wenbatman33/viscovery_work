import React from 'react';
import PropTypes from 'prop-types';

const divStyle = {
  fontSize: '14px',
  color: 'rgba(26, 10, 10, 0.5)',
  marginTop: '20px',
  textAlign: 'center',
  padding: '0 8px',
};

const EmptyCategoryListHolder = props => (
  <div style={divStyle}>
    {props.text}
  </div>
);

EmptyCategoryListHolder.propTypes = {
  text: PropTypes.string,
};

export default EmptyCategoryListHolder;
