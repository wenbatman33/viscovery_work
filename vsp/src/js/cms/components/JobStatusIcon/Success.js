import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';

import Bubble from './Bubble';

import styles from './styles.scss';

const TOOLTIP_TIMEOUT = 500;

class Success extends React.Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    message: PropTypes.string,
  };

  state = {
    tooltip: false,
  };
  showTimer = null;
  hideTimer = null;

  handleMouseEnter = (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.clearTimer();
    this.showTimer = setTimeout(() => {
      this.setState({
        tooltip: true,
      });
    }, TOOLTIP_TIMEOUT);
  };

  handleMouseLeave = (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.clearTimer();
    this.hideTimer = setTimeout(() => {
      this.setState({
        tooltip: false,
      });
    }, TOOLTIP_TIMEOUT);
  };

  clearTimer = () => {
    clearTimeout(this.showTimer);
    clearTimeout(this.hideTimer);
  };

  render() {
    const { handleMouseEnter, handleMouseLeave } = this;
    const { text, message } = this.props;
    const { tooltip } = this.state;
    return (
      <div styleName="circle success" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <p>{text}</p>
        {tooltip && message
          ? <Bubble>{message}</Bubble>
          : null
        }
      </div>
    );
  }
}

export default CSSModules(Success, styles, { allowMultiple: true });
