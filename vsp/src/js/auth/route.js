import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route, Switch } from 'react-router-dom';

import { App, ForgetBox } from './components';
import { GroupReselectContainer, GroupSelectContainer, LoginContainer, SigninContainer } from './containers';
import { ifNeedLogin } from '../utils/routerUtil';

class SigninRoute extends React.Component {
  componentWillMount() {
    ifNeedLogin(this.props.history.replace);
  }

  componentWillReceiveProps(nextProps) {
    ifNeedLogin(nextProps.history.replace);
  }

  render() {
    return <SigninContainer />;
  }
}

SigninRoute.propTypes = {
  history: PropTypes.object,
};

const LoginSwitch = ({ match }) => (
  <LoginContainer>
    <Switch>
      <Route exact path={match.url} component={SigninRoute} />
      <Route exact path={`${match.url}/select`} component={GroupSelectContainer} />
      <Route exact path={`${match.url}/reselect`} component={GroupReselectContainer} />
      <Route exact path={`${match.url}/forgetPwd`} component={ForgetBox} />
      <Redirect to={match.url} />
    </Switch>
  </LoginContainer>
);

LoginSwitch.propTypes = {
  match: PropTypes.object,
};

const AuthSwitch = ({ match }) => (
  <Switch>
    <Route path={`${match.url}/signin`} component={LoginSwitch} />
    <Redirect to={`${match.url}/signin`} />
  </Switch>
);

AuthSwitch.propTypes = {
  match: PropTypes.object,
};

const AuthRoute = () => (
  <App>
    <Route component={AuthSwitch} />
  </App>
);

export default AuthRoute;
