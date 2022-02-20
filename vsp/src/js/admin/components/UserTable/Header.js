// import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';

import styles from './header.scss';


class Header extends React.Component {
  render() {
    return (
      <div styleName="container">
        <div styleName="userId">id</div>
        <div styleName="account">帳號</div>
        <div styleName="username">姓名</div>
        <div styleName="company">公司名稱</div>
        <div styleName="tel_number">聯絡電話</div>
        <div styleName="creator">開設者</div>
        <div styleName="manipulate" />
      </div>
    );
  }
}

export default CSSModules(Header, styles);
