/**
 * Created by amdis on 2016/9/29.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';

import {
  checkIsLogin,
  composeChecks,
  permissionCheck,
} from 'utils/routerUtil';

import App from '../containers/AppContainer';
import Tag2AdSwitch from './Tag2AdSwitch';


class Tag2AdRoute extends React.Component {
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
    return (
      <App {...this.props}>
        <Route component={Tag2AdSwitch} />
      </App>
    );
  }
}

Tag2AdRoute.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default Tag2AdRoute;
