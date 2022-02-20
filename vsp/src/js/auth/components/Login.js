/**
* Created Date : 2016/9/5
* Copyright (c) Viscovery.co
* Author : Amdis Liu <amdis.liu@viscovery.co>
* Contributor :
* Description :
*/

import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';

import styles from '../styles/main.scss';

class Login extends React.Component {

  render() {
    return (
      <div styleName="container">
        { this.props.children }
      </div>
    );
  }
}

Login.propTypes = {
  children: PropTypes.object,
};

export default CSSModules(Login, styles);
