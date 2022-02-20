import React from 'react';

const carouselChildFunc = WrappedComponent => (
  class CarouselChild extends React.PureComponent {
    render() {
      return (
        <div
          style={{
            display: 'inline-block',
            verticalAlign: 'middle',
          }}
        >
          <WrappedComponent
            {...this.props}
          />
        </div>
      );
    }
  }
);

export default carouselChildFunc;
