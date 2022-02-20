import React from 'react';
import CSSModules from 'react-css-modules';

import { TextInput } from 'vidya/Form';

import styles from './TextInputDemo.scss';

const TextInputDemo = () => (
  <div styleName="container">
    <strong>Text Input</strong>
    <div styleName="element">
      <TextInput
        placeholder="輸入集數"
        value="V for Vendetta"
      />
    </div>
    <div styleName="element">
      <TextInput
        placeholder="輸入集數"
        invalid
        invalidMessage="請輸入整數"
      />
    </div>
    <div styleName="element">
      <TextInput
        placeholder="輸入密碼"
        password
      />
    </div>
    <div styleName="black">
      <TextInput
        placeholder="輸入集數"
        value="V for Vendetta"
        gray
        invalid
      />
    </div>
  </div>
);

export default CSSModules(TextInputDemo, styles);
