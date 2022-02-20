import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

import { Redirect, Route, Switch } from 'react-router-dom';

import App from './components/App';

import TagChanceReportContainer from './containers/TagChanceReportContainer';
import { checkIsLogin, composeChecks, permissionCheck } from '../utils/routerUtil';

const propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

class ReportRoute extends PureComponent {
  componentWillMount() {
    const { match, history } = this.props;
    composeChecks(checkIsLogin, permissionCheck(match.url))(history.replace);
  }

  componentWillReceiveProps(nextProps) {
    const { match, history } = nextProps;
    composeChecks(checkIsLogin, permissionCheck(match.url))(history.replace);
  }

  render() {
    const { match, location } = this.props;
    return (
      <App location={location}>
        <Switch>
          <Route exact path={match.url} component={TagChanceReportContainer} />
          <Redirect to={match.url} />
        </Switch>
      </App>
    );
  }
}

ReportRoute.propTypes = propTypes;

export default ReportRoute;
