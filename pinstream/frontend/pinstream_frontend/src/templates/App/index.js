import React from 'react';
import CSSModules from 'react-css-modules';
import { Router, Route, hashHistory, browserHistory } from 'react-router';
import Login from '../Login';
import VideoList from '../VideoList';
import VideoPage from '../VideoPage';
import NotFound from '../NotFound';
import LoadingPage from '../LoadingPage';

import style from './Main.scss';

const { PinstreamUtilitiesWeb } = require('../../utilities');

let historyProvider = hashHistory;
if (process.env.NODE_ENV === 'production') {
  historyProvider = browserHistory;
}

function checkExpires(replace) {
  if (PinstreamUtilitiesWeb.isExpires()) {
    PinstreamUtilitiesWeb.removeTokenInfoTolocalStorage();
    replace({
      pathname: PinstreamUtilitiesWeb.indexpage
    });
    return true;
  }
  return false;
}

function checkLogin(nextState, replace) {
  //todo check condition uid ect...
  if (!PinstreamUtilitiesWeb.isExpires()) {
    if (nextState.location !== undefined && nextState.location.query.origin === 'chrome') {
      replace({
        pathname: '/LoadingPage'
      });
    } else {
      replace({
        pathname: '/VideoList'
      });
    }
  }
}

function requireAuth(nextState, replace) {
  checkExpires(replace);
}

const Main = () => (
  <Router key={Math.random()} history={historyProvider}>
    <Route path={PinstreamUtilitiesWeb.indexpage} component={Login} onEnter={checkLogin} />
    <Route path="/VideoList" component={VideoList} onEnter={requireAuth} />
    <Route path="/VideoPage/:vd" component={VideoPage} onEnter={requireAuth} />
    <Route path="/LoadingPage" component={LoadingPage} />
    <Route path="*" component={NotFound} />
  </Router>
);


export default CSSModules(Main, style);
