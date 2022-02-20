import * as types from '../actions/types';

const initialState = {
  users: [],
  roleOptions: [],
  groups: [],
  countries: [],
  briefGroups: [],
  adSettings: {},
};

const adminReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.RECEIVE_USERS:
      return Object.assign(
        {},
        state,
        {
          users: action.users,
        }
      );
    case types.RECEIVE_ROLE_OPTIONS:
      return Object.assign(
        {},
        state,
        {
          roleOptions: action.roleOptions,
        }
      );
    case types.RECEIVE_GROUPS:
      return Object.assign(
        {},
        state,
        {
          groups: action.groups,
        }
      );
    case types.RECEIVE_COUNTRIES:
      return Object.assign(
        {},
        state,
        {
          countries: action.country_infos,
        }
      );
    case types.GET_BRIEF_GROUPS_SUCCESS:
      return Object.assign(
        {},
        state,
        {
          briefGroups: action.briefGroups,
        }
      );
    case types.GET_AD_SETTING:
      return Object.assign({}, state, { adSettings: action.payload });
    default:
      return state;
  }
};

export default adminReducer;
