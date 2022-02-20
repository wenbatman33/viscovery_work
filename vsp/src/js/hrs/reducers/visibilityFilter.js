import * as types from '../actions/types';

const initialState = 'default';

const visibilityFilter = (state = initialState, action) => {
  switch (action.type) {
    case types.CHANGE_VISIBILITY_FILTER:
      return action.filter;
    default:
      return state;
  }
};

export default visibilityFilter;
