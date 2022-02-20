import PropTypes from 'prop-types';
/**
* Created Date : 2016/9/10
* Copyright (c) Viscovery.co
* Author : Amdis Liu <amdis.liu@viscovery.co>
* Contributor :
* Description : For displaying simple error string messages.
 * User can provide custom class to override the default class.
*/

import React from 'react';
import CSSModules from 'react-css-modules';
import styles from '../styles/error_message.scss';

class ErrorMessage extends React.Component {
  render() {
    const { className } = this.props;
    const style = this.props.position === 'left' ? ' pull-left' : ' pull-right';
    return (
      <div className={className} styleName={style} >
        {this.props.text}
      </div>
    );
  }
}

ErrorMessage.defaultProps = {
  position: 'left',
};
ErrorMessage.propTypes = {
  text: PropTypes.string.isRequired,
  className: PropTypes.string,
  position: PropTypes.oneOf(['right', 'left']),
};

export default CSSModules(ErrorMessage, styles);
