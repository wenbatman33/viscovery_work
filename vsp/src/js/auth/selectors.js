import { NAME } from './constants';

export const getErrorMessage = state => state[NAME].errorMessage;
export const isLoginFail = state => state[NAME].loginFail;

export const getChoices = state => state[NAME].choices;
export const getGroups = state => state[NAME].groups;
export const getRoles = state => state[NAME].roles;

export const getUploadEnabled = state => state[NAME].currentRoleInfo.enable_upload;
export const getCurrentGroup = state => state[NAME].currentGroup;
export const getCurrentRole = state => state[NAME].currentRole;
export const getAllowedModules = state => state[NAME].currentRoleInfo.allowed_modules;

export const getUser = state => state[NAME].user;

export const currentRoleInfo = state => state[NAME].currentRoleInfo;
