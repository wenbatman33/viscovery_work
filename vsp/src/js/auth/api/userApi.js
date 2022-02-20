/**
 * Created by amdis on 2017/8/1.
 */
import { ApiUtil } from '../../utils';

const ENDPOINT = '/api/users';

export const getUserInfo = id => ApiUtil.get(`${ENDPOINT}/${id}`);

export const setUserRole = (userId, data) => ApiUtil.patch(`${ENDPOINT}/${userId}/roles`, data);

export const getCurrentUserRole = userId => ApiUtil.get(`${ENDPOINT}/${userId}/roles`);
