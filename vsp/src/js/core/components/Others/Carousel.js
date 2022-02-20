import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';

import Button from 'vidya/Button/Button';

import styles from './Carousel.scss';

const getPosition = children =>
  children.map(ele => ({
    left: ele.getBoundingClientRect().left,
    right: ele.getBoundingClientRect().right,
  }));

const getVisibility = visible => (visible ? null : 'hidden');


const getRightOutside = containerRight => positions =>
  positions.filter(ele => ele.right > containerRight);

const getLeftOutside = containerleft => positions =>
  positions.filter(ele => ele.right <= containerleft);

const head = arr => (arr.length ? arr[0] : null);
const last = arr => (arr.length ? arr[arr.length - 1] : null);

class Carousel extends React.PureComponent {
  constructor(props) {
    super(props);

    this.moveTo = this.moveTo.bind(this);
    this.getContainerPosition = this.getContainerPosition.bind(this);
    this.handleRight = this.handleRight.bind(this);
    this.handleLeft = this.handleLeft.bind(this);
    this.handleHover = this.handleHover.bind(this);
    this.getViewPortRange = this.getViewPortRange.bind(this);

    this.childrenRef = [];

    this.state = {
      translateX: 0,
      rightNav: true,
      leftNav: false,
    };
  }

  getContainerPosition() {
    const {
      left,
      right,
    } = this.container.getBoundingClientRect();

    return {
      left,
      right,
    };
  }

  getViewPortRange() {
    const positions = getPosition(this.childrenRef);
    const {
      left: containerLeft,
      right: containerRight,
    } = this.getContainerPosition();

    const eleIndex = [];

    positions.forEach((pos, index) => {
      if (pos.left >= containerLeft && pos.right <= containerRight) {
        eleIndex.push(index);
      }
    });

    if (eleIndex.length === 0) {
      return null;
    }

    return {
      start: eleIndex[0],
      end: eleIndex[eleIndex.length - 1],
    };
  }

  handleLeft() {
    const positions = getPosition(this.childrenRef);
    const {
      left: containerLeft,
      right: containerRight,
    } = this.getContainerPosition();
    const outsideList = getLeftOutside(containerLeft)(positions);
    const width = containerRight - containerLeft;
    const candidates = outsideList.filter(position =>
      position.left > (last(outsideList).right - width)
    );

    const target = head(candidates);
    if (target) {
      this.moveTo(containerLeft - target.left);
    }
  }

  handleRight() {
    const positions = getPosition(this.childrenRef);
    const {
      left: containerLeft,
      right: containerRight,
    } = this.getContainerPosition();
    const target = head(getRightOutside(containerRight)(positions));

    if (target) {
      this.moveTo(containerLeft - target.left);
    }
  }

  handleHover() {
    const positions = getPosition(this.childrenRef);
    const {
      left: containerLeft,
      right: containerRight,
    } = this.getContainerPosition();

    const rightOutsider = getRightOutside(containerRight)(positions);
    const leftOutsider = getLeftOutside(containerLeft)(positions);

    const rightNav = rightOutsider.length > 0;
    const leftNav = leftOutsider.length > 0;

    this.setState({
      rightNav,
      leftNav,
    });
  }

  moveTo(n) {
    const {
      translateX,
    } = this.state;

    if (isNaN(parseFloat(translateX + n))) return;

    this.setState({
      translateX: translateX + n,
    });
  }

  render() {
    this.childrenRef = [];
    const children = React.Children.map(this.props.children, (child, index) => (
      React.cloneElement(
        child,
        {
          ref: (node) => {
            if (index < React.Children.count(this.props.children)) {
              this.childrenRef[index] = node;
            }
          },
        },
      )
    ));

    return (
      <div
        styleName="container"
        ref={(node) => { this.container = node; }}
        onMouseOver={this.handleHover}
      >
        <div
          styleName="moveLeft"
          style={{
            visibility: getVisibility(this.state.leftNav),
          }}
        >
          <Button
            vdStyle="icon"
            vdSize="secondary"
            onClick={this.handleLeft}
            throttle={400}
          >
            <i
              className="fa fa-angle-left"
              aria-hidden="true"
            />
          </Button>
        </div>
        <div styleName="mask">
          <div
            styleName="content"
            style={{
              transform: `translateX(${this.state.translateX}px)`,
            }}
          >
            {children}
          </div>
        </div>
        <div
          styleName="moveRight"
          style={{
            visibility: getVisibility(this.state.rightNav),
          }}
        >
          <Button
            vdStyle="icon"
            vdSize="secondary"
            onClick={this.handleRight}
            throttle={400}
          >
            <i
              className="fa fa-angle-right"
              aria-hidden="true"
            />
          </Button>
        </div>
      </div>
    );
  }
}

Carousel.propTypes = {
  children: PropTypes.node,
};

export default CSSModules(Carousel, styles);
