import React from 'react';

import LazyloadImage from 'vidya/Others/LazyloadImage';

class LazyloadImageDemo extends React.PureComponent {
  render() {
    return (
      <div>
        <h3>{'<LazyloadImage>'}</h3>
        <div
          style={{
            margin: '30px 0',
          }}
        >
          <LazyloadImage
            src="http://via.placeholder.com/350x150"
          />
        </div>
      </div>
    );
  }
}

LazyloadImageDemo.propTypes = {};

export default LazyloadImageDemo;
