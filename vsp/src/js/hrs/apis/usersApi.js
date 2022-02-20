import {
  ApiUtil,
} from 'utils';

const endpoint = '/api/users';

export const getAllUsersApi = () =>
  ApiUtil.get(`${endpoint}`);
