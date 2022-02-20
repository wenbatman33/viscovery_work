import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import { withRouter } from 'react-router';

import AMSideNav from './AMSideNav';
import styles from './App.scss';

const App = ({ children, location }) => (
  <div styleName="container">
    <div styleName="left">
      <AMSideNav selected={location.pathname} />
    </div>
    <div styleName="right">
      { children }
    </div>
  </div>
);

App.propTypes = {
  children: PropTypes.node,
  location: PropTypes.object,
};

export default withRouter(CSSModules(App, styles));
