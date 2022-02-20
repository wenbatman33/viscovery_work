/* *******
 Created Date : 2016/9/2
 File Name : auth-actions.js
 Copyright (c) Viscovery.co
 Author : Amdis Liu
 Description :
 ****** */

import { ApiUtil, cookieUtil, LogUtil, routerUtil } from '../utils';
import {
  systemApi,
  roleApi,
  userApi,
  groupApi,
} from './api';
import cms from '../cms';
import hrs from '../hrs';
import admin from '../admin';

import * as types from './types';


/*
 *  Action Creators
 */

export const loginSuccess = loginInfo => (
  {
    type: types.LOGIN_SUCCESS,
    loginInfo,
  }
);

export const loginFail = message => (
  {
    type: types.LOGIN_FAIL,
    message,
  }
);

export const logoutSuccess = () => (
  {
    type: types.LOGOUT_SUCCESS,
  }
);

export const logoutFail = message => (
  {
    type: types.LOGIN_FAIL,
    message,
  }
);

export const loadUserSuccess = user => (
  {
    type: types.LOAD_USER_SUCCESS,
    user,
  }
);

export const getGroupsSuccess = groups => (
  {
    type: types.GET_GROUPS_SUCCESS,
    groups,
  }
);

export const getRolesSuccess = roles => (
  {
    type: types.GET_ROLES_SUCCESS,
    roles,
  }
);

export const getCurrentRoleSuccess = choices => (
  {
    type: types.GET_CURRENT_ROLE_SUCCESS,
    choices,
  }
);

export const patchUserSuccess = (groupId, roleId, roleInfo) => (
  {
    type: types.PATCH_USER_SUCCESS,
    groupId,
    roleId,
    roleInfo,
  }
);

export const loadRepatchUserSuccess = (groupInfo, roleInfo) => (
  {
    type: types.REPATCH_USER_SUCCESS,
    groupInfo,
    roleInfo,
  }
);

export function receiveToken(loginInfo) {
  const token = loginInfo.access_token;
  cookieUtil.saveToken(token);
  return loginSuccess(loginInfo);
}

export function logIn(userName, password) {
  return dispatch => (
    systemApi.login(userName, password)
      .then((res) => {
        dispatch(loginSuccess(res));
        ApiUtil.token = res.access_token;
        ApiUtil.account = res.account;
        setTimeout(() => {
          cookieUtil.saveAccount(res.account);
          cookieUtil.saveToken(res.access_token);
          cookieUtil.saveUid(res.uid);
        });
      })
      .then(() => {
        routerUtil.pushHistory('/auth/signin/select');
      })
      .catch((ex) => {
        if (ex.response && ex.response.status === 401) {
          dispatch(loginFail('帳號或密碼輸入錯誤，請重新嘗試!'));
        } else {
          let message = '帳號或密碼輸入錯誤，請重新嘗試!';
          if (ex.json && ex.json.message) {
            message = '帳號或密碼輸入錯誤，請重新嘗試!';
          } else {
            LogUtil.debug(ex);
          }
          dispatch(loginFail(message));
        }
      })
  );
}

export function requestBriefGroups() {
  return dispatch => (
    groupApi.getAllGroupMapping()
      .then((res) => {
        dispatch(getGroupsSuccess(res.groups));
      })
      .catch((ex) => {
        LogUtil.error('get groups failed');
        LogUtil.exception(ex);
      })
  );
}

export function requestRoles() {
  return dispatch => (
    roleApi.getAllRoles()
      .then((res) => {
        dispatch(getRolesSuccess(res.roles));
      })
      .catch((ex) => {
        LogUtil.error('get roles failed');
        LogUtil.exception(ex);
      })
  );
}

export function getCurrentRole() {
  const uid = cookieUtil.getUid();
  return dispatch => (
    userApi.getCurrentUserRole(uid)
      .then((res) => {
        dispatch(getCurrentRoleSuccess(res.groups));
      })
      .catch((ex) => {
        LogUtil.error('get current user groups and roles failed');
        LogUtil.exception(ex);
      })
  );
}

const roleChange = () => (
  {
    type: types.ROLE_CHANGE,
  }
);

export function queryUser(uid) {
  LogUtil.log('queryUser');
  return dispatch => (
    userApi.getUserInfo(uid)
      .then(res => dispatch(loadUserSuccess(res.users[0])))
      .catch((ex) => {
        LogUtil.error('query user info failed');
        LogUtil.exception(ex);
      })
  );
}

export function patchRole(groupId, roleId) {
  const data = new FormData();
  data.append('group_id', groupId);
  data.append('role_id', roleId);
  const uid = cookieUtil.getUid();
  return dispatch => (
    userApi.setUserRole(uid, data)
      .then((res) => {
        dispatch(roleChange());
        dispatch(queryUser(uid));
        dispatch(patchUserSuccess(groupId, roleId, res));
        cookieUtil.saveGRids(groupId, roleId);
        cookieUtil.savePermission(res.allowed_modules);
        cookieUtil.saveViewHrs(res.view_hrs);
        LogUtil.log('patch Group and Role');
      })
      .then(() => {
        const group = Number(groupId);
        const role = Number(roleId);

        if (group === 1) {
          switch (role) {
            case 1:
              routerUtil.pushHistory(`/${admin.constants.NAME}`);
              break;
            case 2:
              routerUtil.pushHistory(`/${cms.constants.NAME}`);
              break;
            case 3:
              routerUtil.pushHistory(`/${cms.constants.NAME}`);
              break;
            case 4:
              routerUtil.pushHistory(`/${hrs.constants.NAME}/dispatch`);
              break;
            case 5:
              routerUtil.pushHistory(`/${hrs.constants.NAME}/`);
              break;
            case 6:
              routerUtil.pushHistory(`/${hrs.constants.NAME}`);
              break;
            default:
          }
        } else if (group > 1) {
          routerUtil.pushHistory(`/${cms.constants.NAME}`);
        }
      })
      .catch((ex) => {
        LogUtil.error('patch Group and Role failed');
        LogUtil.exception(ex);
      })
  );
}

export function loadToken() {
  const data = new FormData();
  LogUtil.log('loadToken');
  const token = cookieUtil.getToken();
  const uid = cookieUtil.getUid();
  const groupId = cookieUtil.getGroupKey();
  const roleId = cookieUtil.getRoleKey();
  data.append('group_id', groupId);
  data.append('role_id', roleId);
  return (dispatch) => {
    if (token) {
      dispatch(requestRoles())
        .then(() => {
          userApi.setUserRole(uid, data)
            .then((res) => {
              dispatch(queryUser(uid));
              const groupInfo = {
                id: groupId,
                name: cookieUtil.getGroup(),
              };
              dispatch(loadRepatchUserSuccess(
                groupInfo,
                res
              ));
              cookieUtil.savePermission(res.allowed_modules);
              LogUtil.log('Repatch Group and Role');
            })
            .catch((ex) => {
              LogUtil.error('Repatch Group and Role failed');
              LogUtil.exception(ex);
            });
        });
    }
  };
}

export const logOut = (expired) => {
  cookieUtil.removeToken();
  cookieUtil.removePermission();
  cookieUtil.removeUid();
  cookieUtil.removeGroup();
  cookieUtil.removeRole();
  cookieUtil.rmGRids();
  cookieUtil.rmViewHrs();
  cookieUtil.removeAccount();
  return (dispatch) => {
    if (ApiUtil.token) {
      return systemApi.logout()
        .then(() => {
          LogUtil.info('logout success');
          dispatch(logoutSuccess());
        })
        .catch((ex) => {
          LogUtil.error('logout failed');
          LogUtil.exception(ex);
        })
        .then(() => {
          delete ApiUtil.token;
          const path = expired ? '/auth/signin?type=expired' : '/auth/signin';
          routerUtil.pushHistory(path);
        });
    }

    return null;
  };
};


export function noIDorPwd() {
  return loginFail('* Both username and password are required.');
}
