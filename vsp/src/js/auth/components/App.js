import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';

import styles from '../styles/app.scss';

const App = ({ children }) => (
  <div styleName="container">
    { children }
  </div>
);

App.propTypes = {
  children: PropTypes.object,
};

export default CSSModules(App, styles);
