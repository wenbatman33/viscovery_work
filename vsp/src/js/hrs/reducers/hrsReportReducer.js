import * as types from '../actions/types';

const initialState = {
  groupbyReports: [],
  reports: [],
  shifts: [],
  shiftMaps: [],
  cache: {},
};

const hrsReportReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.RECEIVE_GROUPBY_REPORTS:
      return {
        ...state,
        groupbyReports: action.payload,
      };
    case types.RECEIVE_REPORTS:
      return {
        ...state,
        reports: action.payload,
      };
    case types.RECEIVE_SHIFTS:
      return {
        ...state,
        shifts: action.shifts,
      };
    case types.RECEIVE_SHIFTMAPS:
      return {
        ...state,
        shiftMaps: action.shiftMaps,
      };
    case types.SET_REPORT_SHIFT_CACHE:
      return {
        ...state,
        cache: {
          ...state.cache,
          shiftId: action.shiftId,
        },
      };
    case types.SET_REPORT_PERSONAL_CACHE:
      return {
        ...state,
        cache: {
          ...state.cache,
          userId: action.userId,
        },
      };
    default:
      return state;
  }
};

export default hrsReportReducer;
