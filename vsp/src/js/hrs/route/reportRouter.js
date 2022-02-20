import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import {
  composeChecks,
  permissionCheck,
} from 'utils/routerUtil';

import { NAME } from '../constants';

import ReportAppContainer from '../containers/ReportAppContainer';


class reportRouter extends React.Component {
  componentWillMount() {
    composeChecks(permissionCheck(`/${NAME}/admin`))(this.props.history.replace);
  }

  componentWillReceiveProps(nextProps) {
    composeChecks(permissionCheck(`/${NAME}/admin`))(nextProps.history.replace);
  }

  render() {
    const { match } = this.props;
    return (
      <Route path={`${match.url}`} component={ReportAppContainer} />
    );
  }
}

reportRouter.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default reportRouter;
