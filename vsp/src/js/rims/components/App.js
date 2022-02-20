import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import styles from './App.scss';

import ModelTabsContainer from '../containers/ModelTabsContainer';

const App = props => (
  <div styleName="rims-app">
    <ModelTabsContainer tabUrl={props.location} />
    { props.children }
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
