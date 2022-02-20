import React from 'react';
import CSSModules from 'react-css-modules';

import { Banner } from 'vidya/Feedback';

import styles from './BannerDemo.scss';

const vdDefault = true;
const BannerDemo = () => (
  <div>
    <strong>Banner</strong>
    <Banner>
      我的朋友，逃往你的孤獨裡去，逃往吹刮著強烈的暴風的地方去吧。你的命運不是叫你做蒼蠅拍子。
    </Banner>
    <Banner vdStyle={vdDefault}>
      妳有妳的身不由己，我有我的無可奈何。
    </Banner>
  </div>
);

export default CSSModules(BannerDemo, styles);
