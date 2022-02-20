import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import HeadSubNav from './HeadSubNav';
import styles from './App.scss';

const App = props => (
  <div styleName="container">
    <HeadSubNav selected={props.location.pathname} />
    { props.children }
  </div>
);

App.propTypes = {
  children: PropTypes.object,
  location: PropTypes.object,
};
export default CSSModules(App, styles);
