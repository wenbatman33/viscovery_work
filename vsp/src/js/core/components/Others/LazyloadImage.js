import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

const isLower = (top, iH) => (
  top > iH
);

const isUpper = (top, bottom) => (
  top < 0 && bottom < 0
);

const isRighter = (left, iW) => (
  left > iW
);
const isLefter = (left, right) => (
  left < 0 && right < 0
);

const isOutside = (element) => {
  const {
    top,
    right,
    bottom,
    left,
  } = element.getBoundingClientRect();

  const {
    innerHeight,
    innerWidth,
  } = window;

  const lower = isLower(top, innerHeight);
  const upper = isUpper(top, bottom);
  const righter = isRighter(left, innerWidth);
  const lefter = isLefter(left, right);

  return (upper || lower || lefter || righter);
};

const eventHandler = (element, cb, options) => {
  const {
    intervalTime,
  } = options;

  return setInterval(
    () => {
      if (!isOutside(element)) {
        return cb();
      }
      return null;
    }, intervalTime
  );
};

class LazyloadImage extends PureComponent {
  constructor(props) {
    super(props);

    this.handleLoaded = this.handleLoaded.bind(this);

    this.state = {
      loaded: false,
    };
  }

  componentDidMount() {
    this.intervalHandler = eventHandler(
      this.img,
      () => (
        this.handleLoaded(true)
      ),
      {
        intervalTime: this.props.intervalTime,
      }
    );
  }

  handleLoaded(loaded) {
    this.setState({
      loaded,
    });

    if (loaded) {
      clearInterval(this.intervalHandler);
    }
  }

  render() {
    const {
      src,
      intervalTime, // eslint-disable-line no-unused-vars
      ...rest
    } = this.props;

    const {
      loaded,
    } = this.state;
    return (
      <img // eslint-disable-line jsx-a11y/img-has-alt
        {...rest}
        src={loaded ? src : null}
        ref={(node) => { this.img = node; }}
      />
    );
  }
}

LazyloadImage.propTypes = {
  src: PropTypes.string,
  intervalTime: PropTypes.number,
};

LazyloadImage.defaultProps = {
  intervalTime: 1000,
};

export default LazyloadImage;
