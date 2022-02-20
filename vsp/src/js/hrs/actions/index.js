import R from 'ramda';
import {
  LogUtil,
} from 'utils';

import {
  arrayToObject,
  objectToArray,
  objectToForm,
} from 'utils/dataTypeUtil';

import { showLoading, hideLoading } from 'vidya/LoadingBar';

import {
  transferDict,
} from '../utils';

import {
  getUnitStatck,
} from '../selectors/liliCocoSelector';

import {
  requestTagsApi,
  requestBrandBriefApi,
  patchTagsApi,
} from '../apis/tagsApi';

import {
  requestTagsMappingApi,
} from '../apis/tagsMappingApi';

import handleTagsPatchData from '../forms/tagForm';
import handleVideosPatchData from '../forms/videoForm';
import {
  handleTaskPatchPriority,
  handleTaskPatchAssignee,
} from '../forms/taskForm';

import {
  getDispatchApi,
  patchDispatchApi,
} from '../apis/dispatchApi';

import {
  getOneTaskApi,
  releaseTaskApi,
  finishTaskApi,
  startTaskApi,
  getAllTaskApi,
  releaseOneTaskApi,
  patchOneTaskApi,
} from '../apis/taskApi';

import {
  postProcessApi,
  finishProcessApi,
} from '../apis/processApi';

import {
  getAllVideosApi,
  getOneVideoApi,
  patchVideoApi,
} from '../apis/videosApi';

import {
  getAllUsersApi,
} from '../apis/usersApi';

import {
  getReportsApi,
} from '../apis/reportsApi';

import {
  getAllShiftApi,
  patchOneShiftApi,
} from '../apis/shiftsApi';

import {
  getAllShiftMapApi,
  postOneShiftMapApi,
  patchOneShiftMapApi,
  deleteOneShiftMapApi,
} from '../apis/shiftMapsApi';

import {
  logOut,
} from '../../auth/actions';

import * as types from './types';

const receiveTags = tags => (
  {
    type: types.RECEIVE_TAGS,
    tags,
  }
);

export const updateTags = (tags, brandId) => {
  const updateList = tags.map(tag => tag.id);
  const tagsDict = tags.reduce(
    (pV, cV) => {
      const result = pV;
      result[cV.id] = cV;
      return result;
    },
    {}
  );

  return {
    type: types.UPDATE_TAGS,
    updateList,
    tagsDict,
    brandId,
  };
};

export const requestTags = (videoId, modelId, brandId) =>
  (dispatch) => {
    dispatch(showLoading());
    return Promise.resolve(requestTagsApi(videoId, modelId, brandId))
      .then(tags => dispatch(receiveTags(tags)))
      .then(() => dispatch(hideLoading()));
  };

export const changeVisibilityFilter = filter => (
  {
    type: types.CHANGE_VISIBILITY_FILTER,
    filter,
  }
);

const receiveBrandBrief = brandBrief => (
  {
    type: types.RECEIVE_BRAND_BRIEF,
    brandBrief,
  }
);

export const requestBrandBrief = (videoId, modelId, brandId) =>
  dispatch =>
    Promise.resolve(requestBrandBriefApi(videoId, modelId, brandId))
      .then((brandBrief) => {
        dispatch(receiveBrandBrief(brandBrief));
      })
      .catch((err) => {
        LogUtil.debug(err);
      });

const patchTags = (userId, processId, tags) =>
  patchTagsApi(handleTagsPatchData(userId, processId, tags));

export const toggleWorkNav = () => (
  {
    type: types.TOGGLE_WORK_NAV,
  }
);

export const toggleWorkNavToShow = () => (
  {
    type: types.TOGGLE_WORK_NAV_TO_SHOW,
  }
);

export const toggleWorkNavToHide = () => (
  {
    type: types.TOGGLE_WORK_NAV_TO_HIDE,
  }
);

const receiveTagsMapping = tagsMapping => (
  {
    type: types.RECEIVE_TAGS_MAPPING,
    tagsMapping,
  }
);

export const requestTagsMapping = lang =>
  dispatch =>
    Promise.resolve(requestTagsMappingApi(lang))
      .then((tagsMapping) => {
        dispatch(receiveTagsMapping({
          ...tagsMapping.entities,
          brands: transferDict(tagsMapping.entities.brands),
          brandsForBrandEditor: tagsMapping.entities.brands,
        }));
      });

export const receiveUnitStack = unitStack => (
  {
    type: types.RECEIVE_UNIT_STACK,
    unitStack,
  }
);

export const clearUnitStack = () => (
  {
    type: types.CLEAR_UNIT_STACK,
  }
);

export const pushUnitStack = (userId, processId, videoId, brandId, units) =>
  (dispatch, getState) => {
    const state = getState();
    const currentUnitStack = getUnitStatck(state);
    const arrayToObjectById = arrayToObject('id');
    const objectToArrayById = objectToArray('id');

    const objResult = {
      ...arrayToObjectById(currentUnitStack),
      ...arrayToObjectById(units),
    };

    const arrayResult = objectToArrayById(objResult);

    if (arrayResult.length >= 10) {
      patchTags(userId, processId, arrayResult)
        .then(() => dispatch(clearUnitStack()));
    } else {
      dispatch(receiveUnitStack(arrayResult));
    }
    return dispatch(updateTags(arrayResult, brandId));
  };

export const forcePatchUnitStack = (userId, processId) =>
  (dispatch, getState) => {
    const state = getState();
    const currentUnitStack = getUnitStatck(state);
    return patchTags(userId, processId, currentUnitStack)
      .then(() => dispatch(clearUnitStack()));
  };

const receiveLookupId = (videoId, modelId, brandId) => (
  {
    type: types.RECEIVE_CURRENT_LOOKUP_ID,
    videoId,
    modelId,
    brandId,
  }
);

const receiveTaskId = taskId => (
  {
    type: types.RECEIVE_TASK_ID,
    taskId,
  }
);

const receiveOneAdminTask = task => (
  {
    type: types.RECEIVE_ONE_ADMIN_TASKS,
    task,
  }
);

const receiveTaskIdFlow = taskId =>
  (dispatch) => {
    dispatch(receiveTaskId(taskId));
    return Promise.resolve(getOneTaskApi(taskId))
      .then(r => r.payload)
      .then(payload => payload.task)
      .then((task) => {
        const {
          video_id: videoId,
          brand_id: brandId,
          model_id: modelId,
        } = task;
        dispatch(receiveLookupId(videoId, modelId, brandId));
      });
  };

export const receiveProcessId = processId => (
  {
    type: types.RECEIVE_PROCESS_ID,
    processId,
  }
);

const patchDispatch = userId => Promise.resolve(patchDispatchApi({
  user_id: userId,
}));

export const getDispatch = userId =>
  getDispatchApi(userId)
    .then(r => r.payload)
    .then(payload => payload.task_id)
    .then((taskId) => {
      if (taskId) {
        return taskId;
      }
      return retryDispatch(userId);
    });

const retryDispatch = userId =>
    patchDispatch(userId)
      .then(() => getDispatch(userId),
      (err) => {
        if (err.response && (err.response.response_code < 1)) {
          return Promise.reject(err.json);
        }
        return getDispatch(userId);
      });

export const getDispatchFlow = userId =>
  dispatch =>
    getDispatch(userId)
      .then((taskId) => {
        dispatch(receiveTaskIdFlow(taskId));
        dispatch(startProcess(userId, taskId));

        return taskId;
      })
      .then(taskId => startTask(taskId))
      .catch(err => Promise.reject(err));

export const startProcess = (userId, taskId) =>
  (dispatch) => {
    const formData = new FormData();
    formData.append('assignee_id', userId);
    formData.append('task_id', taskId);

    return Promise.resolve(postProcessApi(formData))
      .then(r => r.payload)
      .then(payload => payload.process_id)
      .then((processId) => {
        dispatch(receiveProcessId(processId));
      });
  };

const startTask = taskId =>
  startTaskApi(taskId);

const finishTask = (taskId, isLabel) =>
  finishTaskApi({
    task_id: taskId,
    is_label: !!isLabel,
  });

const releaseTask = (userId) => {
  const formData = new FormData();
  formData.append('user_id', userId);

  return releaseTaskApi(formData);
};

export const wrappedLogout = (userId, processId) =>
  dispatch =>
    dispatch(forcePatchUnitStack(userId, processId))
      .then(() => finishProcessApi(processId), err => Promise.reject({ from: 'logout PatchFail', userId, processId, ...err }))
      .then(() => releaseTask(userId), err => Promise.reject({ from: 'logout ProcessFail', userId, processId, ...err }))
      .then(() =>
        dispatch(logOut())
        , err => Promise.reject({ from: 'logout ReleaseTaskFail', userId, processId, ...err })
      );

export const submitTask = (userId, taskId, processId, isLabel) =>
  dispatch =>
    dispatch(forcePatchUnitStack(userId, processId))
      .then(() => finishProcessApi(processId), err => Promise.reject({ from: 'PatchFail', userId, taskId, processId, ...err }))
      .then(() => finishTask(taskId, isLabel), err => Promise.reject({ from: 'ProcessFail', userId, taskId, processId, ...err }))
      .then(null, err => Promise.reject({ from: 'TaskFail', userId, taskId, processId, ...err }));

export const submitTaskButLogout = (userId, taskId, processId, isLabel) =>
  dispatch =>
    dispatch(forcePatchUnitStack(userId, processId))
      .then(() => finishTask(taskId, isLabel))
      .then(dispatch(receiveLookupId(0, 0, 0)))
      .then(dispatch(receiveTaskId(0)))
      .then(dispatch(wrappedLogout(userId, processId)));

const receiveAdminUsers = users => (
  {
    type: types.RECEIVE_ADMIN_USERS,
    users,
  }
);

const receiveAdminVideos = videos => (
  {
    type: types.RECEIVE_ADMIN_VIDEOS,
    videos,
  }
);

const receiveOneAdminVideo = video => (
  {
    type: types.RECEIVE_ONE_ADMIN_VIDEOS,
    video,
  }
);

const receiveAdminTasks = tasks => (
  {
    type: types.RECEIVE_ADMIN_TASKS,
    tasks,
  }
);

export const getAdminTasks = () =>
  dispatch =>
    Promise.resolve(getAllTaskApi())
      .then(r => r.payload)
      .then(payload => payload.tasks)
      .then((tasks) => {
        dispatch(receiveAdminTasks(tasks));
      });

export const getOneTask = taskId =>
  dispatch =>
    Promise.resolve(getOneTaskApi(taskId))
      .then(r => r.payload)
      .then(payload => payload.task)
      .then((task) => {
        dispatch(receiveOneAdminTask(task));
      });

export const getAllVideos = () =>
dispatch =>
  Promise.resolve(getAllVideosApi())
    .then(r => r.payload)
    .then(payload => payload.videos)
    .then((videos) => {
      dispatch(receiveAdminVideos(videos));
    });

const getOneVideos = videoId =>
  dispatch =>
    Promise.resolve(getOneVideoApi(videoId))
      .then(r => r.payload)
      .then(payload => payload.video)
      .then((video) => {
        dispatch(receiveOneAdminVideo(video));
      });

export const getAllUsers = () =>
dispatch =>
  Promise.resolve(getAllUsersApi())
    .then(r => r.users)
    .then(users => dispatch(receiveAdminUsers(users)));

const patchVideoPriority = (videoId, priority) =>
  patchVideoApi(videoId)(handleVideosPatchData(priority));

export const updateOneVideoPriority = (videoId, priority) =>
  dispatch =>
    Promise.resolve(patchVideoPriority(videoId, priority))
      .then(
        () => dispatch(getOneVideos(videoId)),
        (err) => {
          dispatch(getOneVideos(videoId));
          throw err;
        }
      );

export const updateManyVideosPriority = (videoIds, priority) =>
  dispatch =>
    Promise.all(videoIds.map(videoId => dispatch(updateOneVideoPriority(videoId, priority))));

const patchTaskPriority = (taskId, priority) =>
  patchOneTaskApi(taskId)(handleTaskPatchPriority(priority));

export const updateOneTaskPriority = (taskId, priority) =>
  dispatch =>
    Promise.resolve(patchTaskPriority(taskId, priority))
      .then(
        () => dispatch(getOneTask(taskId)),
        (err) => {
          dispatch(getOneTask(taskId));
          throw err;
        },
      );

export const updateManyTasksPriority = (taskIds, priority) =>
  dispatch =>
    Promise.all(taskIds.map(taskId => dispatch(updateOneTaskPriority(taskId, priority))));

const patchTaskAssignee = (taskId, assignerId, assigneeId) =>
  patchOneTaskApi(taskId)(handleTaskPatchAssignee(assignerId, assigneeId));

export const updateOneTaskAssignee = (taskId, assignerId, assigneeId) =>
  dispatch =>
    Promise.resolve(patchTaskAssignee(taskId, assignerId, assigneeId))
      .then(
        () => dispatch(getOneTask(taskId)),
        (err) => {
          dispatch(getOneTask(taskId));
          throw err;
        }
      );

export const updateManyTasksAssignee = (taskIds, assignerId, assigneeId) =>
  dispatch =>
    Promise.all(
      taskIds.map(taskId =>
      dispatch(updateOneTaskAssignee(taskId, assignerId, assigneeId))
      )
    );

const releaseOneTask = taskId =>
  Promise.resolve(
      releaseOneTaskApi(taskId)
    );

export const releaseOneTaskFlow = taskId =>
  dispatch =>
    Promise.resolve(releaseOneTask(taskId))
      .then(
        () => dispatch(getOneTask(taskId)),
        (err) => {
          dispatch(getOneTask(taskId));
          throw err;
        }
      );

export const releaseManyTasks = taskIds =>
  dispatch =>
    Promise.all(taskIds.map(taskId => dispatch(releaseOneTaskFlow(taskId))));

export const receiveOnlineUserIds = onlineUserIds => (
  {
    type: types.RECEIVE_ONLINE_USER_IDS,
    onlineUserIds,
  }
);

export const receiveGroupbyReports = groupbyReports => (
  {
    type: types.RECEIVE_GROUPBY_REPORTS,
    payload: groupbyReports,
  }
);

export const receiveReports = reports => (
  {
    type: types.RECEIVE_REPORTS,
    payload: reports,
  }
);

export const getGroupbyReports = (since, to) =>
  dispatch =>
    Promise.resolve(getReportsApi(since, to, 1))
      .then(r => r.payload)
      .then(payload => dispatch(receiveGroupbyReports(payload)));

export const getReports = (since, to, lang, userId) =>
  (dispatch) => {
    dispatch(showLoading());
    return Promise.resolve(getReportsApi(since, to, 0, lang, userId))
      .then(r => r.payload)
      .then(payload => dispatch(receiveReports(payload)))
      .then(() => dispatch(hideLoading()));
  };

export const receiveShifts = shifts => (
  {
    type: types.RECEIVE_SHIFTS,
    shifts,
  }
);

export const getAllShifts = () =>
  dispatch =>
    Promise.resolve(getAllShiftApi())
      .then(r => r.payload)
      .then(payload => dispatch(receiveShifts(payload)));

export const updateOneShift = shift =>
  () =>
    Promise.resolve(patchOneShiftApi(shift.hrs_shift_id)(objectToForm(shift)));

export const updateManyShifts = shifts =>
  dispatch =>
    Promise.all(shifts.map(shift => dispatch(updateOneShift(shift))))
      .then(() => dispatch(getAllShifts()));

const receiveShiftMaps = shiftMaps => (
  {
    type: types.RECEIVE_SHIFTMAPS,
    shiftMaps,
  }
);

export const getAllShiftMap = () =>
  dispatch =>
    Promise.resolve(getAllShiftMapApi())
      .then(r => r.payload)
      .then(payload => dispatch(receiveShiftMaps(payload)));

const postOneShiftMap = shiftMap =>
  () =>
    Promise.resolve(postOneShiftMapApi(objectToForm(shiftMap)));

const patchOneShiftMap = shiftMapId => shiftMap =>
  () =>
    Promise.resolve(patchOneShiftMapApi(shiftMapId)(objectToForm(shiftMap)));

const deleteOneShiftMap = shiftMapId =>
  () =>
    Promise.resolve(deleteOneShiftMapApi(shiftMapId));

const mapShiftMapRecord = dispatch => (shiftMap) => {
  if (shiftMap.hrs_shift_map_id) {
    const {
      hrs_shift_map_id,
      ...rest
    } = shiftMap;

    return dispatch(patchOneShiftMap(hrs_shift_map_id)(rest));
  }
  return dispatch(postOneShiftMap(shiftMap));
};

const genDeleteShiftMap = dispatch => (preShiftMapRecords, shiftMapRecords) =>
  preShiftMapRecords.filter(
    shiftMap => !shiftMapRecords.find(
      R.allPass([
        R.eqProps('hrs_shift_id', shiftMap),
        R.eqProps('hrs_member_uid', shiftMap),
      ])
    )
  ).map(shiftMap => dispatch(deleteOneShiftMap(shiftMap.hrs_shift_map_id)));

export const updateShiftMapRecords = (preShiftMapRecords, shiftMapRecords) =>
  dispatch =>
    Promise.all([
      ...shiftMapRecords.map(mapShiftMapRecord(dispatch)),
      ...genDeleteShiftMap(dispatch)(preShiftMapRecords, shiftMapRecords),
    ])
      .then(() => dispatch(getAllShiftMap()));

export const setReportShiftCache = shiftId => (
  {
    type: types.SET_REPORT_SHIFT_CACHE,
    shiftId,
  }
);

export const setReportPersonalCache = userId => (
  {
    type: types.SET_REPORT_PERSONAL_CACHE,
    userId,
  }
);
