import { NAME } from '../constants';

const prefix = `${NAME}/`;

const typeGenerator = type => `${prefix}${type}`;

export const RECEIVE_TAGS = typeGenerator('RECEIVE_TAGS');
export const UPDATE_TAGS = typeGenerator('UPDATE_TAGS');
export const CHANGE_VISIBILITY_FILTER = typeGenerator('CHANGE_VISIBILITY_FILTER');
export const RECEIVE_BRAND_BRIEF = typeGenerator('RECEIVE_BRAND_BRIEF');
export const RECEIVE_BRAND_DICT = typeGenerator('RECEIVE_BRAND_DICT');
export const TOGGLE_WORK_NAV = typeGenerator('TOGGLE_WORK_NAV');
export const TOGGLE_WORK_NAV_TO_SHOW = typeGenerator('TOGGLE_WORK_NAV_TO_SHOW');
export const TOGGLE_WORK_NAV_TO_HIDE = typeGenerator('TOGGLE_WORK_NAV_TO_HIDE');
export const RECEIVE_TAGS_MAPPING = typeGenerator('RECEIVE_TAGS_MAPPING');
export const RECEIVE_UNIT_STACK = typeGenerator('PUSH_UNIT_STACK');
export const CLEAR_UNIT_STACK = typeGenerator('CLEAR_UNIT_STACK');
export const RECEIVE_CURRENT_MODEL_ID = typeGenerator('RECEIVE_CURRENT_MODEL_ID');
export const RECEIVE_CURRENT_BRAND_ID = typeGenerator('RECEIVE_CURRENT_BRAND_ID');
export const RECEIVE_CURRENT_VIDEO_ID = typeGenerator('RECEIVE_CURRENT_VIDEO_ID');
export const RECEIVE_CURRENT_LOOKUP_ID = typeGenerator('RECEIVE_CURRENT_LOOKUP_ID');
export const RECEIVE_TASK_ID = typeGenerator('RECEIVE_TASK_ID');
export const RECEIVE_PROCESS_ID = typeGenerator('RECEIVE_PROCESS_ID');
export const RECEIVE_TASK_CANDIDATES = typeGenerator('RECEIVE_TASK_CANDIDATES');
export const RECEIVE_ADMIN_USERS = typeGenerator('RECEIVE_ADMIN_USERS');
export const RECEIVE_ADMIN_TASKS = typeGenerator('RECEIVE_ADMIN_TASKS');
export const RECEIVE_ONE_ADMIN_TASKS = typeGenerator('RECEIVE_ONE_ADMIN_TASKS');
export const RECEIVE_ADMIN_VIDEOS = typeGenerator('RECEIVE_ADMIN_VIDEOS');
export const RECEIVE_ONE_ADMIN_VIDEOS = typeGenerator('RECEIVE_ONE_ADMIN_VIDEOS');
export const RECEIVE_ONLINE_USER_IDS = typeGenerator('RECEIVE_ONLINE_USER_IDS');
export const RECEIVE_GROUPBY_REPORTS = typeGenerator('RECEIVE_GROUPBY_REPORTS');
export const RECEIVE_REPORTS = typeGenerator('RECEIVE_REPORTS');
export const RECEIVE_SHIFTS = typeGenerator('RECEIVE_SHIFTS');
export const RECEIVE_SHIFTMAPS = typeGenerator('RECEIVE_SHIFTMAPS');
export const SET_REPORT_SHIFT_CACHE = typeGenerator('SET_REPORT_SHIFT_CACHE');
export const SET_REPORT_PERSONAL_CACHE = typeGenerator('SET_REPORT_PERSONAL_CACHE');

