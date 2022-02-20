import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route, Switch } from 'react-router-dom';

import { App } from './components';
import {
  CreateGroupContainer,
  CreateUserContainer,
  GroupContainer,
  UpdateGroupContainer,
  UpdateUserContainer,
  UserContainer,
} from './containers';
import { checkIsLogin, composeChecks, permissionCheck } from '../utils/routerUtil';

const AdminSwitch = ({ match }) => (
  <Switch>
    <Route exact path={`${match.url}/group`} component={GroupContainer} />
    <Route exact path={`${match.url}/group/create`} component={CreateGroupContainer} />
    <Route exact path={`${match.url}/group/:group_id`} component={UpdateGroupContainer} />
    <Route exact path={`${match.url}/user`} component={UserContainer} />
    <Route exact path={`${match.url}/user/create`} component={CreateUserContainer} />
    <Route exact path={`${match.url}/user/:user_id`} component={UpdateUserContainer} />
    <Redirect to={match.url} />
  </Switch>
);

AdminSwitch.propTypes = {
  match: PropTypes.object,
};

class AdminRoute extends React.Component {
  componentWillMount() {
    composeChecks(checkIsLogin, permissionCheck(this.props.match.url))(this.props.history.replace);
  }

  componentWillReceiveProps(nextProps) {
    composeChecks(checkIsLogin, permissionCheck(nextProps.match.url))(nextProps.history.replace);
  }

  render() {
    return (
      <App>
        <Route component={AdminSwitch} />
      </App>
    );
  }
}

AdminRoute.propTypes = {
  match: PropTypes.object,
  history: PropTypes.object,
};

export default AdminRoute;
