import React from 'react';
import CSSModules from 'react-css-modules';

import styles from './header.scss';

class Header extends React.Component {
  render() {
    return (
      <div styleName="container">
        <div styleName="group">加入群組</div>
        <div styleName="role">角色</div>
        <div styleName="doUpload">上傳功能</div>
        <div styleName="manipulate" />
      </div>
    );
  }
}

export default CSSModules(Header, styles);
