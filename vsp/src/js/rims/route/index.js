import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

import { Redirect, Route, Switch } from 'react-router-dom';

import App from '../components/App';
import FaceModelContainer from '../containers/FaceModelContainer';
import { checkIsLogin, composeChecks, permissionCheck } from '../../utils/routerUtil';

const propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

class RimsRoute extends PureComponent {
  componentWillMount() {
    const { match, history } = this.props;
    composeChecks(checkIsLogin, permissionCheck(match.url))(history.replace);
  }

  componentWillReceiveProps(nextProps) {
    const { match, history } = nextProps;
    composeChecks(checkIsLogin, permissionCheck(match.url))(history.replace);
  }

  render() {
    const { location, match } = this.props;
    return (
      <App location={location}>
        <Switch>
          <Route exact path={`${match.url}/models/:modelId`} component={FaceModelContainer} />
          <Redirect to={`${match.url}/models/1`} />
        </Switch>
      </App>
    );
  }
}

RimsRoute.propTypes = propTypes;

export default RimsRoute;
