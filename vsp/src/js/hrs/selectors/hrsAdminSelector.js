import R from 'ramda';
import { NAME } from '../constants';

const filterHrsMember = user =>
  R.any(permission => permission.role_id === 4)(user.permissions);

export const getAdminTasks = state => state[NAME].hrsAdminReducer.tasks;
export const getAdminUsers = state => state[NAME].hrsAdminReducer.users;
export const getAdminVideos = state => state[NAME].hrsAdminReducer.videos;
export const getOnlineUserIds = state => state[NAME].hrsAdminReducer.onlineUserIds;
export const getHrsMember = R.compose(R.filter(filterHrsMember), getAdminUsers);
