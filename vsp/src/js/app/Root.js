/**
* Created Date : 2016/9/6
* Copyright (c) Viscovery.co
* Author : Amdis Liu <amdis.liu@viscovery.co>
* Contributor :
* Description :
*/
import React from 'react';

import CSSModules from 'react-css-modules';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';

import { routerUtil } from 'utils';
import configureStore from './configureStore';
import i18n from './i18next';
import route from './route';

import styles from './Root.scss';

class Root extends React.Component {
  constructor(props) {
    super(props);

    this.store = configureStore();
    this.history = routerUtil.getHistory();
  }

  render() {
    const { store, history } = this;
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <I18nextProvider i18n={i18n}>
            {route()}
          </I18nextProvider>
        </ConnectedRouter>
      </Provider>
    );
  }
}

export default CSSModules(Root, styles);
