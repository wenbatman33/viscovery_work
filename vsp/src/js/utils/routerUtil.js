/**
 * Created by amdis on 2016/9/6.
 */
import { createHashHistory as createHistory } from 'history';
import qhistory from 'qhistory';
import { parse, stringify } from 'qs';

import ApiUtil from './ApiUtil';
import cookieUtil from './cookieUtil';

const history = qhistory(
  createHistory(),
  stringify,
  parse
);

class routerUtil {
  static pushHistory(nextPath) {
    history.push(nextPath);
  }

  static getHistory() {
    return history;
  }
}

export default routerUtil;

export const storeTokenToApiUtil = () => {
  const token = cookieUtil.getToken();
  const permission = cookieUtil.getPermission();
  const account = cookieUtil.getAccount();
  if (token && permission && permission.length > 0) {
    ApiUtil.token = token;
    ApiUtil.account = account;
  } else {
    cookieUtil.removeToken();
    cookieUtil.removePermission();
  }

  // todo: valid token in the stage
};

export const checkIsLogin = (replace) => {
  if (!cookieUtil.getToken()) {
    return replace('/auth/signin');
  }
  return null;
};

export const ifNeedLogin = (replace) => {
  if (cookieUtil.getToken()) {
    return replace('/');
  }
  return null;
};

export const permissionCheck = needPermissions => (
  (replace) => {
    const permission = cookieUtil.getPermission();
    if (!permission.includes(needPermissions)) {
      return replace('/');
    }
    return null;
  }
);

const wrapperReplace = replace => (
  (...params) => {
    replace(...params);
    return true;
  }
);

export const composeChecks = (...fnArray) => (
  (...params) => {
    const newParams = params.map((param) => {
      if (typeof param === 'function' && param.name === 'replace') {
        return wrapperReplace(param);
      }
      return param;
    });

    for (let i = 0; i < fnArray.length; i += 1) {
      if (fnArray[i](...newParams)) {
        return;
      }
    }
  }
);
