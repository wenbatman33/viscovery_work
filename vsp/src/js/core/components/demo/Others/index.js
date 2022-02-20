import React from 'react';
import CSSModules from 'react-css-modules';

import ImagePlaceholderDemo from './ImagePlaceholderDemo';
import CarouselDemo from './CarouselDemo';
import LazyloadImageDemo from './LazyloadImageDemo';

import styles from './Main.scss';

const Others = () => (
  <div>
    <a
      href="http://awsgit.viscovery.co/Product_Center/vsp/blob/develop/src/js/core/document/Others.md"
      target="_blank"
      rel="noopener noreferrer"
    >
      <h2>Others</h2>
    </a>
    <CarouselDemo />
    <ImagePlaceholderDemo />
    <LazyloadImageDemo />
  </div>
);


export default CSSModules(Others, styles);
