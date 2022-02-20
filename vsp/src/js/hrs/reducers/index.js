import { combineReducers } from 'redux';

import tagsReducer from './tagsReducer';
import visibilityFilter from './visibilityFilter';
import liliCocoReducer from './liliCocoReducer';
import structureReducer from './structureReducer';
import hrsJobReducer from './hrsJobReducer';
import hrsAdminReducer from './hrsAdminReducer';
import hrsReportReducer from './hrsReportReducer';

const hrsReducer = combineReducers({
  tagsReducer,
  visibilityFilter,
  liliCocoReducer,
  structureReducer,
  hrsJobReducer,
  hrsAdminReducer,
  hrsReportReducer,
});

export default hrsReducer;
