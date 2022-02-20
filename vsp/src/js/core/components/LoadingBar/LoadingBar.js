import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import styles from './styles.scss';

const LoadingBar = props => (
  <div styleName={props.showLoading ? 'overlay' : 'hidden'}>
    <div styleName="msg-container">
      <div styleName="message">{props.loadingMessage}</div>
      <div styleName="spinner" />
    </div>
  </div>
);

LoadingBar.defaultProps = {
  showLoading: false,
  loadingMessage: 'Loading...',
};
LoadingBar.propTypes = {
  showLoading: PropTypes.bool,
  loadingMessage: PropTypes.string,
};


export default CSSModules(LoadingBar, styles);
