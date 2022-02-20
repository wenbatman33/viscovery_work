/**
 * Created by amdis on 2016/9/29.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route, Switch } from 'react-router-dom';

import dispatchAppRouter from './dispatchAppRouter';
import adminRouter from './adminRouter';
import reportRouter from './reportRouter';

import {
  checkIsLogin, composeChecks,
} from '../../utils/routerUtil';


class hrsRoutes extends React.Component {
  componentWillMount() {
    composeChecks(checkIsLogin)(this.props.history.replace);
  }

  componentWillReceiveProps(nextProps) {
    composeChecks(checkIsLogin)(nextProps.history.replace);
  }

  render() {
    const { match } = this.props;
    return (
      <Switch>
        <Route path={`${match.url}/admin`} component={adminRouter} />
        <Route exact path={`${match.url}/dispatch`} component={dispatchAppRouter} />
        <Route path={`${match.url}/report`} component={reportRouter} />
        <Redirect to={`${match.url}/admin`} />
      </Switch>
    );
  }
}

hrsRoutes.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default hrsRoutes;
