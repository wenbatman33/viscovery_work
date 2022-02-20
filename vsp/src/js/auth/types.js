/**
 * Created by amdis on 2016/9/21.
 */
import { NAME } from './constants';

const prefix = `${NAME}/`;

export const LOGIN = `${prefix}LOGIN`;
export const LOGIN_SUCCESS = `${prefix}LOGIN_SUCCESS`;
export const LOGIN_FAIL = `${prefix}LOGIN_FAIL`;
export const LOGOUT = `${prefix}LOGOUT_FAIL`;
export const LOGOUT_SUCCESS = `${prefix}LOGOUT_SUCCESS`;
export const LOGOUT_FAIL = `${prefix}LOGOUT_FAIL`;
export const LOAD_USER_SUCCESS = `${prefix}LOAD_USER_SUCCESS`;
export const PATCH_USER_SUCCESS = `${prefix}PATCH_USER_SUCCESS`;
export const GET_ROLES_SUCCESS = `${prefix}GET_ROLES_SUCCESS`;
export const GET_GROUPS_SUCCESS = `${prefix}GET_GROUPS_SUCCESS`;
export const GET_CURRENT_ROLE_SUCCESS = `${prefix}GET_CURRENT_ROLE_SUCCESS`;
export const REPATCH_USER_SUCCESS = `${prefix}REPATCH_USER_SUCCESS`;
export const ROLE_CHANGE = `${prefix}ROLE_CHANGE`;
