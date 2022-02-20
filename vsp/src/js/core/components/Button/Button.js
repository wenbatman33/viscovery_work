import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';

import styles from './Button.scss';

class Button extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.setLock = this.setLock.bind(this);
    this.lock = false;
  }

  setLock(toLock) {
    this.lock = toLock;
  }

  handleClick(e) {
    if (this.props.throttle) {
      if (!this.lock) {
        this.setLock(true);
        this.props.onClick();

        setTimeout((() => {
          this.setLock(false);
        }), this.props.throttle);
      }
    } else if (this.props.onClick) {
      this.props.onClick(e);
    }
  }

  render() {
    const { style, children, vdStyle, vdSize, disable } = this.props;
    return (
      <button
        styleName={`${(disable ? 'disable' : vdStyle)} ${vdSize}`}
        onClick={this.handleClick}
        disabled={disable}
        style={style}
      >
        {children}
      </button>
    );
  }
}

Button.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.node,
  vdStyle: PropTypes.string,
  vdSize: PropTypes.string,
  disable: PropTypes.bool,
  throttle: PropTypes.number,
  style: PropTypes.object,
};

Button.defaultProps = {
  vdStyle: 'primary',
  vdSize: 'normal',
  disable: false,
};

export default CSSModules(Button, styles, { allowMultiple: true });
