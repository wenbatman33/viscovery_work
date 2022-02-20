import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route, Switch } from 'react-router-dom';

import {
  checkIsLogin,
  permissionCheck,
  composeChecks,
} from '../utils/routerUtil';

import App from './components/App';
import GetRecognitionTasks from './containers/GetRecognitionTasks';
import LandingPage from './components/LandingPage';

class SystemRoute extends React.PureComponent {
  componentWillMount() {
    composeChecks(
      checkIsLogin,
      permissionCheck(this.props.match.url)
    )(this.props.history.replace);
  }

  componentWillReceiveProps(nextProps) {
    composeChecks(
      checkIsLogin,
      permissionCheck(nextProps.match.url)
    )(nextProps.history.replace);
  }

  render() {
    const {
      match,
      location,
    } = this.props;
    return (
      <App location={location}>
        <Switch>
          <Route exact path={`${match.url}/recognitionTasks`} component={GetRecognitionTasks} />
          <Route exact path={`${match.url}/versionReport`} component={LandingPage} />
          <Redirect to={`${match.url}/recognitionTasks`} />
        </Switch>
      </App>
    );
  }
}

SystemRoute.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

export default SystemRoute;
