/**
 * Created by amdis on 2017/3/22.
 */
import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import styles from './App.scss';
import SideNav from './SideNav';

const App = props => (
  <div styleName="container">
    <div styleName="left-pane">
      <SideNav location={props.location} />
    </div>
    <div styleName="right-pane">
      {props.children}
    </div>
  </div>
);

App.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  children: PropTypes.shape({
    type: PropTypes.func,
  }),
};

export default CSSModules(App, styles);
