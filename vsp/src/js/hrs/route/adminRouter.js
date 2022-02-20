import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';

import {
  composeChecks,
  permissionCheck,
} from 'utils/routerUtil';


import { NAME } from '../constants';

import AdminAppContainer from '../containers/AdminAppContainer';

class adminRouter extends React.Component {
  componentWillMount() {
    composeChecks(permissionCheck(`/${NAME}/admin`))(this.props.history.replace);
  }

  componentWillReceiveProps(nextProps) {
    composeChecks(permissionCheck(`/${NAME}/admin`))(nextProps.history.replace);
  }

  render() {
    const { match } = this.props;
    return (
      <Route path={`${match.url}`} component={AdminAppContainer} />
    );
  }
}

adminRouter.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default adminRouter;
