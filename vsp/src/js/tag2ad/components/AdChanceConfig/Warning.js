/**
 * Created by amdis on 2017/5/10.
 */
import React from 'react';
import PropTypes from 'prop-types';

const Warning = props => (
  <div
    style={{
      fontSize: '14px',
      color: '#EB5757',
    }}
  >
    {props.message}
  </div>
);

Warning.propTypes = {
  message: PropTypes.string,
};

export default Warning;
