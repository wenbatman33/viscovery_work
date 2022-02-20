import { combineReducers } from 'redux';

import faceModelReducer from './faceModelReducer';
import modelTabsReducer from './modelTabsReducer';

const rimsReducer = combineReducers({
  faceModelReducer,
  modelTabsReducer,
});

export default rimsReducer;
