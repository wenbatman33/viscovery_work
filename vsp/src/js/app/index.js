/* eslint-disable global-require */
import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Root from './Root';


require('../../asset/favicon.ico');

const renderApp = Component =>
  render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('app')
  );

renderApp(Root);

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./Root', () => {
    const NextRoot = require('./Root').default;
    renderApp(NextRoot);
    // renderApp(Root.default)
  });
}
