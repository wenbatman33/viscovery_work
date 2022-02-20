import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';

import styles from './DateBubble.scss';

class DateBubble extends React.Component {
  render() {
    return (
      <div styleName="container">
        <div styleName="statusWording">
          {this.props.wording}
        </div>
        <div styleName="container_box">
          <div styleName="container_trigger">
            <div styleName="title">有效日期:</div>
            <div>{`${this.props.startTime} - ${this.props.endTime}`}</div>
          </div>
        </div>
      </div>
    );
  }
}

DateBubble.propTypes = {
  wording: PropTypes.string,
  startTime: PropTypes.string,
  endTime: PropTypes.string,
};

export default CSSModules(DateBubble, styles);
