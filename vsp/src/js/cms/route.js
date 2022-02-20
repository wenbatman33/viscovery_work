import PropTypes from 'prop-types';
import React from 'react';

import { Redirect, Route, Switch } from 'react-router-dom';

import { App } from './components';
import { ReportContainer, StatusContainer, VideoContainer } from './containers';
import { checkIsLogin, composeChecks, permissionCheck } from '../utils/routerUtil';

const CmsSwitch = ({ match }) => (
  <Switch>
    <Route exact path={`${match.url}/status`} component={StatusContainer} />
    <Route exact path={`${match.url}/series/:series_id`} component={VideoContainer} />
    <Route exact path={`${match.url}/report/:videoId`} component={ReportContainer} />
    <Redirect to={`${match.url}/status`} />
  </Switch>
);

CmsSwitch.propTypes = {
  match: PropTypes.object.isRequired,
};

class CmsRoute extends React.Component {
  componentWillMount() {
    composeChecks(checkIsLogin, permissionCheck(this.props.match.url))(this.props.history.replace);
  }

  componentWillReceiveProps(nextProps) {
    composeChecks(checkIsLogin, permissionCheck(nextProps.match.url))(nextProps.history.replace);
  }

  render() {
    return (
      <App single={this.props.location.pathname.startsWith(`${this.props.match.url}/report/`)}>
        <Route component={CmsSwitch} />
      </App>
    );
  }
}

CmsRoute.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default CmsRoute;
