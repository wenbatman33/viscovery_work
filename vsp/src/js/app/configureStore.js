/**
 * Created by amdis on 2016/9/6.
 */
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux';

import { routerUtil } from 'utils';
import { NODE_ENV, DEVELOPMENT } from './constants';
import createReducer from './reducer';

let configureStore;
const history = routerUtil.getHistory();
const router = routerMiddleware(history);
if (NODE_ENV === DEVELOPMENT) {
  configureStore = preloadedState =>
    createStore(
      createReducer,
      preloadedState,
      compose(
        applyMiddleware(router),
        applyMiddleware(thunk),
        window.devToolsExtension ? window.devToolsExtension() : f => f
      )
    );
} else {
  configureStore = preloadedState =>
    createStore(
      createReducer,
      preloadedState,
      compose(
        applyMiddleware(router),
        applyMiddleware(thunk)
      )
    );
}

const exportDefault = configureStore;

export default exportDefault;
