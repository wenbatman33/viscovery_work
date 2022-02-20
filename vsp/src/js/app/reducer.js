/**
 * Created by amdis on 2016/9/19.
 */
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import R from 'ramda';

import { loadingBarReducer } from 'vidya/LoadingBar';

import auth from '../auth';
import cms from '../cms';
import tag2ad from '../tag2ad';
import hrs from '../hrs';
import system from '../system';
import langReducer from './langReducer';
import report from '../report';
import rims from '../rims';
import { LOADING_BAR_REDUCER_NAME } from './constants';
import {
  constants as sharedConstants,
  reducer as sharedReducers,
} from '../shared';
import admin from '../admin';

const routeReducerName = 'routing';
const localeReducerName = 'lang';

// these reducers will be cleared only when app refreshed
const keepStateReducers = [
  routeReducerName,
  localeReducerName,
  sharedConstants.NAME,
];

const roleChangePreserved = [
  auth.constants.NAME,
];

const allReducers = {
  [routeReducerName]: routerReducer,
  [auth.constants.NAME]: auth.reducer,
  [localeReducerName]: langReducer,
  [cms.constants.NAME]: cms.reducer,
  [tag2ad.constants.NAME]: tag2ad.reducer,
  [hrs.constants.NAME]: hrs.reducer,
  [system.constants.NAME]: system.reducer,
  [LOADING_BAR_REDUCER_NAME]: loadingBarReducer,
  [report.constants.NAME]: report.reducer,
  [rims.constants.NAME]: rims.reducer,
  [sharedConstants.NAME]: sharedReducers,
  [admin.constants.NAME]: admin.reducer,
};

const appReducer = combineReducers(allReducers);

const resetCertainReducers = (storeState, action, unReset = keepStateReducers) => {
  const reducerKeys = Object.keys(allReducers);
  const finalState = {};

  for (let i = 0; i < reducerKeys.length; i += 1) {
    const key = reducerKeys[i];
    const name = String(key);
    const reducer = allReducers[reducerKeys[i]];

    if (reducer !== undefined) {
      if (!unReset.includes(name)) {
        // reset the reducer state
        const nextSate = reducer(undefined, action);
        finalState[key] = nextSate;
      } else {
        // merge current reducer state to next state tree
        const nextState = reducer(storeState[key], action);
        finalState[key] = nextState;
      }
    }
  }

  return finalState;
};


const createReducer = (state, action) => {
  let nextState;
  switch (action.type) {
    case auth.types.LOGOUT_SUCCESS:
      nextState = resetCertainReducers(state, action, keepStateReducers);
      return appReducer(nextState, action);
    case auth.types.ROLE_CHANGE: {
      const unReset = R.compose(R.dropRepeats, R.concat(keepStateReducers))(roleChangePreserved);
      nextState = resetCertainReducers(state, action, unReset);
      return appReducer(nextState, action);
    }
    default:
      return appReducer(state, action);
  }
};

export default createReducer;
