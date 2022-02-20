import React from 'react';
import CSSModules from 'react-css-modules';

import styles from './ImagePlaceholderDemo.scss';

import ImagePlaceholder from '../../Others/ImagePlaceholder';


const ImagePlaceholderDemo = () => (
  <div>
    <h3>Image Placeholder</h3>
    <div styleName="img1">
      <ImagePlaceholder
        src="https://goo.gl/vHAcBK"
        alt="img"
      />
    </div>
    <div styleName="img2">
      <ImagePlaceholder
        src="https://goo.gl/vHAcBK"
        alt="img"
      />
    </div>
    <div styleName="img2">
      <ImagePlaceholder
        src=""
        alt="img"
      />
    </div>
  </div>
);

export default CSSModules(ImagePlaceholderDemo, styles);
