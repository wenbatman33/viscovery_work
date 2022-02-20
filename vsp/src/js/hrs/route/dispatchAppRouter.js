import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import {
  composeChecks,
  permissionCheck,
} from 'utils/routerUtil';

import { NAME } from '../constants';

import DispatchAppContainer from '../containers/DispatchAppContainer';

class dispatchAppRouter extends React.Component {
  componentWillMount() {
    composeChecks(permissionCheck(`/${NAME}/dispatch`))(this.props.history.replace);
  }

  componentWillReceiveProps(nextProps) {
    composeChecks(permissionCheck(`/${NAME}/dispatch`))(nextProps.history.replace);
  }

  render() {
    const { match } = this.props;
    return (
      <Route path={`${match.url}`} component={DispatchAppContainer} />
    );
  }
}

dispatchAppRouter.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default dispatchAppRouter;
