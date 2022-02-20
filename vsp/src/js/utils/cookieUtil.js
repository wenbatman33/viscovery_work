/**
 * Created by amdis on 2016/9/6.
 */
import cookie from 'browser-cookies';
import { LogUtil } from './logUtil';

const tokenName = 'token';
const uidKey = 'uid';
const permissionArray = 'permission';
const groupStr = 'group';
const roleStr = 'role';
const groupKey = 'groupId';
const roleKey = 'roleId';
const VIEW_HRS = 'viewHrs';
const KEY_LOCALE = 'locale';
const ACCOUNT = 'account';

cookie.defaults.expires = 7;

class cookieUtil {
  static isTokenExisted() {
    const token = cookie.get(tokenName);
    if (!token) {
      LogUtil.debug('token not existed');
      return false;
    }
    return true;
  }

  static saveToken(authToken) {
    if (authToken) {
      cookie.set(tokenName, authToken);
    } else {
      LogUtil.debug('Save token failed');
    }
  }

  static getToken() {
    return cookie.get(tokenName);
  }

  static removeToken() {
    cookie.erase(tokenName);
  }

  static saveUid(uid) {
    if (uid) {
      cookie.set(uidKey, String(uid));
    } else {
      LogUtil.debug('Save uid failed');
    }
  }

  static removeUid() {
    cookie.erase(uidKey);
  }

  static getUid() {
    return cookie.get(uidKey);
  }

  static saveAccount(account) {
    if (account) {
      cookie.set(ACCOUNT, String(account));
    } else {
      LogUtil.debug('Save account failed');
    }
  }

  static removeAccount() {
    cookie.erase(ACCOUNT);
  }

  static getAccount() {
    return cookie.get(ACCOUNT);
  }

  static savePermission(permission) {
    if (permission) {
      cookie.set(permissionArray, JSON.stringify(permission));
    } else {
      LogUtil.debug('Save permission failed');
    }
  }

  static removePermission() {
    cookie.erase(permissionArray);
  }

  static getPermission() {
    return JSON.parse(cookie.get(permissionArray));
  }


  /* GroupName and RoleName */
  static isGroupOrRoleExist() {
    const group = cookie.get(groupStr);
    const role = cookie.get(roleStr);
    if (group === null || role === null) {
      LogUtil.debug('role or group not existed');
      return false;
    }
    return true;
  }

  static saveGroupAndRole(groupName, roleName) {
    if (groupName && roleName) {
      cookie.set(groupStr, String(groupName));
      cookie.set(roleStr, String(roleName));
    }
  }

  static removeGroup() {
    cookie.erase(groupStr);
  }

  static removeRole() {
    cookie.erase(roleStr);
  }

  static getGroup() {
    return cookie.get(groupStr);
  }

  static getRole() {
    return cookie.get(roleStr);
  }

  /* GroupId and RoleId */
  static saveGRids(groupId, roleId) {
    if (groupId && roleId) {
      cookie.set(groupKey, String(groupId));
      cookie.set(roleKey, String(roleId));
    }
  }

  static getGroupKey() {
    return Number(cookie.get(groupKey));
  }

  static getRoleKey() {
    return Number(cookie.get(roleKey));
  }

  static rmGRids() {
    cookie.erase(groupKey);
    cookie.erase(roleKey);
  }

  // save viewHrs

  static saveViewHrs(viewHrs) {
    cookie.set(VIEW_HRS, String(viewHrs));
  }

  static getViewHrs() {
    return Number(cookie.get(VIEW_HRS));
  }

  static rmViewHrs() {
    cookie.erase(VIEW_HRS);
  }

  static setLocale(locale) {
    cookie.set(KEY_LOCALE, locale);
  }

  static getLocale() {
    return cookie.get(KEY_LOCALE);
  }

  static removeLocale() {
    cookie.erase(KEY_LOCALE);
  }
}

export default cookieUtil;
