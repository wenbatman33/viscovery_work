import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import NormalApp from '../components/NormalApp';

const normalAppRouter = ({ match }) => (
  <Route path={`${match.url}`} component={NormalApp} />
);

normalAppRouter.propTypes = {
  match: PropTypes.object.required,
};

export default normalAppRouter;
