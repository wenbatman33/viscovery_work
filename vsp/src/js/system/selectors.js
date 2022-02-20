import { NAME } from './constants';

export const getMessage = state => state[NAME].message;
export const getResponseCode = state => state[NAME].response_code;
export const getTasks = state => state[NAME].tasks;
export const getTasksTotalCount = state => state[NAME].tasks_total_count;
export const getTasksFilterCount = state => state[NAME].tasks_filter_count;
export const getUpdateTime = state => state[NAME].update_time;
export const getFailureTasks = state => state[NAME].failure_tasks;
export const getSuccessCount = state => state[NAME].success_count;
export const getFailureCount = state => state[NAME].failure_count;

export const getVersion = state => state[NAME].version;
