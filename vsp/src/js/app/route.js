import PropTypes from 'prop-types';
import React from 'react';

import { Redirect, Route, Switch } from 'react-router-dom';

import asyncComponentHOC from 'shared/hoc/asyncComponentHOC';
import { App, LandingPage } from './components';
import features from './features';
import { storeTokenToApiUtil } from '../utils/routerUtil';

const propTypes = {
  match: PropTypes.object.isRequired,
};

const asyncComponents = features.map(feature => (
  {
    ...feature,
    route: asyncComponentHOC(
      () => System.import(`../${feature.constants.NAME}/route`)
        .then(bundle => bundle.default)
    ),
  }
));


const AppSwitch = ({ match }) => (
  <Switch>
    <Route exact path={match.url} component={LandingPage} />
    {asyncComponents.map(feature => (
      <Route key={feature.constants.NAME} path={`${match.url}${feature.constants.NAME}`} component={feature.route} />
    ))}
    <Redirect to={match.url} />
  </Switch>
);

AppSwitch.propTypes = propTypes;

class AppRoute extends React.Component {
  componentWillMount() {
    storeTokenToApiUtil();
  }

  componentWillReceiveProps() {
    storeTokenToApiUtil();
  }

  render() {
    return (
      <App>
        <Route component={AppSwitch} />
      </App>
    );
  }
}

export default () => <AppRoute />;
