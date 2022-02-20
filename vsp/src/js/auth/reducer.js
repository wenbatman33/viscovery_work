/**
 * Created by Amdis on 2016/9/2.
 */

import { cookieUtil } from 'utils';
import * as types from './types';

const initialState = {
  token: null,
  loginFail: false,
  choices: {},
  account: '',
  uid: 0,
  user: null,
  groups: [],
  roles: [],
  currentGroup: null,
  currentRole: null,
  currentRoleInfo: {},
};

export default function auth(state = initialState, action) {
  switch (action.type) {
    case types.LOGIN :
      return Object.assign({}, state, {});
    case types.LOGIN_SUCCESS :
      return Object.assign({}, state, {
        loginFail: false,
        token: action.loginInfo.access_token,
        account: action.loginInfo.account,
        uid: action.loginInfo.uid,
        choices: action.loginInfo.groups,
      });
    case types.GET_ROLES_SUCCESS:
      return Object.assign({}, state, { roles: action.roles });
    case types.GET_GROUPS_SUCCESS:
      return Object.assign({}, state, { groups: action.groups });
    case types.GET_CURRENT_ROLE_SUCCESS:
      return Object.assign({}, state, { choices: action.choices });
    case types.PATCH_USER_SUCCESS: {
      const curGroup = state.groups.find(group => Number(group.id) === Number(action.groupId));
      const curRole = state.roles.find(role => Number(role.id) === Number(action.roleId));
      cookieUtil.saveGroupAndRole(curGroup.name, curRole.name);
      return Object.assign({}, state, {
        currentGroup: curGroup,
        currentRole: curRole,
        currentRoleInfo: action.roleInfo,
      });
    }
    case types.REPATCH_USER_SUCCESS: {
      const { roleInfo } = action;
      const role = state.roles.find(r => Number(r.id) === Number(action.roleInfo.role_id));
      return Object.assign({}, state, {
        currentGroup: action.groupInfo,
        currentRole: role,
        currentRoleInfo: roleInfo,
      });
    }
    case types.LOGOUT :
      return Object.assign({}, state, { loggingOut: true });
    case types.LOGOUT_SUCCESS :
      return Object.assign({}, state,
        { logoutFail: false, loggingOut: false, user: null, token: null, choices: {} });
    case types.LOGOUT_FAIL :
      return Object.assign({}, state, { logoutFail: true, loggingOut: false });
    case types.LOAD_USER_SUCCESS :
      return Object.assign({}, state, { user: action.user });
    case types.LOGIN_FAIL :
      return Object.assign({}, state, { loginFail: true, errorMessage: action.message });
    default :
      return state;
  }
}
