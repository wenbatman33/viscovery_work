import { NAME } from '../constants';

const prefix = `${NAME}/`;

const typeGenerator = type => `${prefix}${type}`;

export const RECEIVE_USERS = typeGenerator('RECEIVE_USERS');
export const RECEIVE_ROLE_OPTIONS = typeGenerator('RECEIVE_ROLE_OPTIONS');

export const RECEIVE_GROUPS = typeGenerator('RECEIVE_GROUPS');
export const RECEIVE_COUNTRIES = typeGenerator('RECEIVE_COUNTRIES');

export const GET_BRIEF_GROUPS_SUCCESS = typeGenerator('GET_BRIEF_GROUPS_SUCCESS');
export const GET_ROLES_SUCCESS = typeGenerator('GET_ROLES_SUCCESS');

export const CREATE_GROUP_SUCCESS = typeGenerator('CREATE_GROUP_SUCCESS');
export const UPDATE_GROUP_SUCCESS = typeGenerator('UPDATE_GROUP_SUCCESS');
export const CREATE_USER_SUCCESS = typeGenerator('CREATE_USER_SUCCESS');
export const UPDATE_USER_SUCCESS = typeGenerator('UPDATE_USER_SUCCESS');

export const GET_AD_SETTING = typeGenerator('GET_AD_SETTING');
