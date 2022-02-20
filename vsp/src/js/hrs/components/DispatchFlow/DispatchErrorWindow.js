import PropTypes from 'prop-types';
import React from 'react';

import Button from 'vidya/Button/Button';

const DispatchErrorWindow = ({ msg, retryCallback }) => (
  <div
    style={{
      textAlign: 'center',
    }}
  >
    <h2>派工錯誤</h2>
    <h4>錯誤訊息: </h4>
    <div><p>{msg}</p></div>
    <h4>請回報開發人員</h4>
    <Button onClick={retryCallback}>
      再試一次
    </Button>
  </div>
);

DispatchErrorWindow.propTypes = {
  retryCallback: PropTypes.func,
  msg: PropTypes.string,
};

export default DispatchErrorWindow;
