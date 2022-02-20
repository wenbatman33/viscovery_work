import React from 'react';
import CSSModules from 'react-css-modules';

import styles from './header.scss';


class Header extends React.Component {
  render() {
    return (
      <div styleName="container">
        <div styleName="name">群組名稱</div>
        <div styleName="maxUpload">影片分析上限</div>
        <div styleName="vip">帳號類型</div>
        <div styleName="hrs">HRS</div>
        <div styleName="members">使用者</div>
        <div styleName="validTime">有效日期</div>
        <div styleName="creator">開設者</div>
        <div styleName="country">所屬地區</div>
        <div styleName="manipulate" />
      </div>
    );
  }
}

export default CSSModules(Header, styles);
