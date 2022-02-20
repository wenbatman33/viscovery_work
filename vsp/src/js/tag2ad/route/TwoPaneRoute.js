import React from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import TwoPanelLayout from '../components/TwoPanelLayout';

const TwoPaneRoute = ({ sidebar: Sidebar, main: Main, ...rest }) => (
  <Route
    {...rest}
    render={matchProps => (
      <TwoPanelLayout
        left={<Sidebar {...matchProps} />}
        right={<Main {...matchProps} />}
      />
    )}
  />
);

TwoPaneRoute.propTypes = {
  sidebar: PropTypes.func,
  main: PropTypes.func,
  rest: PropTypes.object,
};

export default TwoPaneRoute;
