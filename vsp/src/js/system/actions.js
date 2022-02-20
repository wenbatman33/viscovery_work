import {
  queryRecognitionTasks,
  queryAdjustRecognitionTasks,
} from './apis';
import * as types from './types';

export function requestRecognitionTasks(params) {
  const priority = params.priority || 'E';
  const offset = params.offset || 0;
  const limit = params.limit || 10;
  const groupName = params.group_name || '';
  const seriesName = params.series_name || '';
  const videoName = params.video_name || '';
  const account = params.account || '';
  const cleancache = params.cleancache || 0;
  return dispatch => (
    queryRecognitionTasks(
      priority, offset, limit, groupName, seriesName, videoName, account, cleancache
    )
      .then(res => dispatch(recieveTasks(res)))
  );
}

export const recieveTasks = res => (
  {
    type: types.RECIEVE_RECOGNITION_TASKS,
    payload: res,
  }
);

export function requestAdjustRecognitionTasks(params) {
  return () => (
    queryAdjustRecognitionTasks(params)
  );
}

export const adjustTasks = res => (
  {
    type: types.ADJUST_RECOGNITION_TASKS,
    payload: res,
  }
);
