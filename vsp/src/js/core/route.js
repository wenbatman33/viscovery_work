import PropTypes from 'prop-types';
import React from 'react';

import { Redirect, Route, Switch } from 'react-router-dom';

import App from './components/App';

const propTypes = {
  match: PropTypes.object.isRequired,
};

const CoreRoute = ({ match }) => (
  <Switch>
    <Route exact path={match.url} component={App} />
    <Redirect to={match.url} />
  </Switch>
);

CoreRoute.propTypes = propTypes;

export default CoreRoute;
