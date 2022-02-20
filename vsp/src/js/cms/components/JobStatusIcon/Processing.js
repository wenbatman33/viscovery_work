import PropTypes from 'prop-types';
import React from 'react';

import RadialProgress from './RadialProgress';

class Processing extends React.Component {
  render() {
    const { text, message } = this.props;
    return <RadialProgress text={text} message={message} />;
  }
}


Processing.propTypes = {
  text: PropTypes.string.isRequired,
  message: PropTypes.string,
};

export default Processing;
