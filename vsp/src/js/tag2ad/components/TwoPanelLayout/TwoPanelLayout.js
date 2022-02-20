import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import styles from './TwoPanelLayout.scss';

class TwoPanelLayout extends React.PureComponent {
  render() {
    return (
      <div styleName="container">
        <div styleName="left-panel">
          {this.props.left}
        </div>
        <div styleName="right-panel">
          {this.props.right}
        </div>
      </div>
    );
  }
}

TwoPanelLayout.propTypes = {
  left: PropTypes.oneOfType(
    [
      PropTypes.element,
      PropTypes.node,
    ]
  ).isRequired,
  right: PropTypes.oneOfType(
    [
      PropTypes.element,
      PropTypes.node,
    ]
  ).isRequired,
};

export default CSSModules(TwoPanelLayout, styles);
