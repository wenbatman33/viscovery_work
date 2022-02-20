import React from 'react';
import CSSModules from 'react-css-modules';

import Carousel from 'vidya/Others/Carousel';

import styles from './CarouselDemo.scss';

const widths = Array(20).fill(0).map(() => 50 * Math.ceil(10 * Math.random()));

class CarouselDemo extends React.PureComponent {
  render() {
    return (
      <div>
        <h3>Carousel</h3>
        <p>block width in [50, 550]</p>
        <div
          style={{
            margin: '30px 0',
          }}
        >
          <Carousel>
            {
              widths.map((width, index) => (
                <div
                  key={index}
                  styleName="block"
                  style={{
                    width: `${width}px`,
                    height: `${width}px`,
                  }}
                >
                  <p>{index}</p>
                </div>
              ))
            }
          </Carousel>
        </div>
      </div>
    );
  }
}

CarouselDemo.propTypes = {};

export default CSSModules(CarouselDemo, styles);
