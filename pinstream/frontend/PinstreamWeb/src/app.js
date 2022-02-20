import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Main from './templates/App';

ReactDOM.render(
  <AppContainer>
    <Main />
  </AppContainer>,
  document.getElementById('app')
);

if (module.hot) {
  module.hot.accept('templates/App', () => {
    const NewMain = require('./templates/App').default;
    ReactDOM.render(
      <AppContainer>
        <NewMain />
      </AppContainer>,
      document.getElementById('app')
    );
  });
}
