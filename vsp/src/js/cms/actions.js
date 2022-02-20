import $ from 'jquery';

import * as types from './types';
import { ApiUtil, LogUtil } from '../utils';

const requestSeriesList = () => ({
  type: types.REQUEST_SERIES_LIST,
});

const receiveSeriesList = series => ({
  type: types.RECEIVE_SERIES_LIST,
  series,
});

const createSeries = series => ({
  type: types.CREATE_SERIES,
  series,
});

const updateSeries = series => ({
  type: types.UPDATE_SERIES,
  series,
});

const deleteSeries = series => ({
  type: types.DELETE_SERIES,
  series,
});

const receiveSeries = series => ({
  type: types.RECEIVE_SERIES,
  series,
});

const requestVideoList = series => ({
  type: types.REQUEST_VIDEO_LIST,
  series,
});

const receiveVideoList = (series, videos) => ({
  type: types.RECEIVE_VIDEO_LIST,
  series,
  videos,
});

const createVideo = video => ({
  type: types.CREATE_VIDEO,
  video,
});

const updateVideo = video => ({
  type: types.UPDATE_VIDEO,
  video,
});

const deleteVideo = video => ({
  type: types.DELETE_VIDEO,
  video,
});

export const receiveVideo = video => ({
  type: types.RECEIVE_VIDEO,
  video,
});

export const removeUpload = upload => ({
  type: types.REMOVE_UPLOAD,
  upload,
});

const startUpload = upload => ({
  type: types.START_UPLOAD,
  upload,
});

const progressUpload = (upload, progress) => ({
  type: types.PROGRESS_UPLOAD,
  upload,
  progress,
});

const finishUpload = (upload, success, errorCode) => ({
  type: types.FINISH_UPLOAD,
  upload,
  success,
  errorCode,
});

const uploadVideo = (dispatch, upload) => {
  /* eslint-disable no-param-reassign */
  upload.xhr = $.ajaxSettings.xhr();
  upload.xhr.upload.onprogress = (event) => {
    if (event.lengthComputable) {
      const progress = (event.loaded * 100) / event.total;
      const action = progressUpload(upload, progress);
      dispatch(action);
    }
  };
  /* eslint-enable */
  const action = progressUpload(upload, 0);
  dispatch(action);

  const url = `${ApiUtil.baseUrl}/api/videos/${upload.video.video_id}/upload`;
  const headers = ApiUtil.token
    ? { Authorization: `Bearer ${ApiUtil.token}` }
    : {};
  const data = new FormData();
  data.append('file', upload.file);
  if (upload.modelIds && upload.modelIds.length) {
    data.append('model_ids', upload.modelIds.join());
    data.append('face_model', upload.faceModel);
  }
  const settings = {
    method: 'POST',
    url,
    headers,
    data,
    processData: false,
    contentType: false,
    xhr: () => upload.xhr,
  };
  return $.ajax(settings);
};

const updateMessage = message => ({
  type: types.UPDATE_MESSAGE,
  message,
});

export const processSeriesList = () => ((dispatch) => {
  let action = updateMessage(null);
  dispatch(action);
  action = requestSeriesList();
  dispatch(action);

  return ApiUtil.get('/api/series')
    .then((response) => {
      action = receiveSeriesList(response.series_lst);
      dispatch(action);
    }).catch((error) => {
      const message = 'Fetch series failed'.concat(error.json
        ? `: ${error.json.message}`
        : ''
      );
      action = updateMessage(message);
      dispatch(action);
    });
});

export const processSeriesCreation = (name, alias, country) => ((dispatch) => {
  let action = updateMessage(null);
  dispatch(action);
  const series = {
    series_id: null,
    series_name: name,
    alias: typeof alias === 'string' ? alias.split(',') : alias,
    country_id: country,
    summary: {
      total: 0,
      available: 0,
    },
  };
  action = createSeries(series);
  dispatch(action);

  const data = new FormData();
  data.append('series_name', name);
  if (alias && Array.isArray(alias) && alias.length > 0) {
    data.append('alias', alias.join('\t'));
  } else if (alias && typeof alias === 'string') {
    data.append('alias', alias);
  }

  if (country) {
    data.append('country_id', country);
  }

  return ApiUtil.post('/api/series', data)
    .then((response) => {
      action = receiveSeries(response);
      dispatch(action);
      return response;
    })
    .catch((error) => {
      const message = 'Create series failed'.concat(error.json
        ? `: ${error.json.message}`
        : ''
      );
      action = updateMessage(message);
      dispatch(action);
      action = deleteSeries(series);
      dispatch(action);
    });
});

export const processSeriesUpdate = (series, name, alias, country) => ((dispatch) => {
  let action = updateMessage(null);
  dispatch(action);
  const object = Object.assign({}, series, {
    series_name: name,
    alias: typeof alias === 'string' ? alias.split(',') : alias,
    country_id: country,
  });
  action = updateSeries(object);
  dispatch(action);

  const data = new FormData();
  data.append('series_name', name);

  if (alias && Array.isArray(alias)) {
    data.append('alias', alias.join('\t'));
  } else if (alias && typeof alias === 'string') {
    data.append('alias', alias);
  }

  if (country) {
    data.append('country_id', country);
  }

  return ApiUtil.patch(`/api/series/${series.series_id}`, data)
    .catch((error) => {
      const message = 'Update series failed'.concat(error.json
        ? `: ${error.json.message}`
        : ''
      );
      action = updateMessage(message);
      dispatch(action);
      action = updateSeries(series);
      dispatch(action);
    });
});

export const processSeriesRemoval = series => ((dispatch) => {
  let action = updateMessage(null);
  dispatch(action);
  action = deleteSeries(series);
  dispatch(action);

  return ApiUtil.erase(`/api/series/${series.series_id}`)
    .catch((error) => {
      const message = 'Delete series failed'.concat(error.json
        ? `: ${error.json.message}`
        : ''
      );
      action = updateMessage(message);
      dispatch(action);
      action = receiveSeries(series);
      dispatch(action);
    });
});

export const processVideoList = series => ((dispatch) => {
  let action = updateMessage(null);
  dispatch(action);
  action = requestVideoList(series);
  dispatch(action);

  return ApiUtil.get(`/api/videos?series_id=${series.series_id}`)
    .then((response) => {
      action = receiveVideoList(series, response.video_lst);
      dispatch(action);
    })
    .catch((error) => {
      const message = 'Fetch videos failed'.concat(error.json
        ? `: ${error.json.message}`
        : ''
      );
      action = updateMessage(message);
      dispatch(action);
    });
});

export const processVideoUpdate = (video, name, series, episode, sourceVideoId, sourceVideoUrl) =>
  (dispatch) => {
    let action = updateMessage(null);
    dispatch(action);
    const object = Object.assign({}, video, {
      video_name: name,
      series_id: series,
      source_video_id: sourceVideoId,
      source_url: sourceVideoUrl,
    });
    action = updateVideo(object);
    dispatch(action);

    const data = new FormData();
    data.append('video_name', name);
    data.append('series_id', series);
    if (episode) {
      data.append('episode', episode);
    }
    if (sourceVideoId) {
      data.append('source_video_id', sourceVideoId);
    }
    if (sourceVideoUrl) {
      data.append('source_video_url', sourceVideoUrl);
    }
    return ApiUtil.patch(`/api/videos/${video.video_id}`, data)
      .catch((error) => {
        const message = 'Update video failed'.concat(error.json
          ? `: ${error.json.message}`
          : ''
        );
        action = updateMessage(message);
        dispatch(action);
        action = updateVideo(video);
        dispatch(action);
      });
  };

export const processVideoRemoval = video => ((dispatch) => {
  let action = updateMessage(null);
  dispatch(action);
  action = deleteVideo(video);
  dispatch(action);

  return ApiUtil.erase(`/api/videos/${video.video_id}`)
    .catch((error) => {
      const message = 'Delete video failed'.concat(error.json
        ? `: ${error.json.message}`
        : ''
      );
      action = updateMessage(message);
      dispatch(action);
      action = receiveVideo(video);
      dispatch(action);
    });
});

export const prepareUpload = (file, series, video, episode) => ({
  type: types.PREPARE_UPLOAD,
  file,
  series,
  video,
  episode,
});

export const prepareUploadWithRecognition = (file, series, modelIds, faceModel) => ({
  type: types.PREPARE_UPLOAD,
  file,
  series,
  modelIds,
  faceModel,
});

export const redoUpload = upload => ({
  type: types.REDO_UPLOAD,
  upload,
});

export const processUpload = upload => ((dispatch) => {
  let action = startUpload(upload);
  dispatch(action);

  if (upload.video) {
    return uploadVideo(dispatch, upload)
      .then((response) => {
        action = finishUpload(upload, 1);
        dispatch(action);
        action = receiveVideo(response);
        dispatch(action);
      })
      .catch((e) => {
        if (e && e.statusText === 'error') {
          if (upload.file.size === 0) {
            action = finishUpload(upload, 3);
            dispatch(action);
          } else {
            action = finishUpload(upload, 2);
            dispatch(action);
          }
        } else {
          action = finishUpload(upload, 2, e.json ? e.json.error_code : null);
          dispatch(action);
        }
      });
  }

  const data = new FormData();
  data.append('video_name', upload.file.name);
  if (upload.series) {
    data.append('series_id', upload.series);
  }
  if (upload.episode) {
    data.append('episode', upload.episode);
  }
  return ApiUtil.post('/api/videos', data)
    .then((response) => {
      action = createVideo(response);
      dispatch(action);
      /* eslint-disable no-param-reassign */
      upload.video = response;
      /* eslint-enable */
      return uploadVideo(dispatch, upload);
    })
    .then((response) => {
      action = finishUpload(upload, 1);
      dispatch(action);
      action = receiveVideo(response);
      dispatch(action);
    })
    .catch((e) => {
      if (e && e.statusText === 'error') {
        if (upload.file.size === 0) {
          action = finishUpload(upload, 3);
          dispatch(action);
        } else {
          action = finishUpload(upload, 2);
          dispatch(action);
        }
      } else {
        action = finishUpload(upload, 2, e.json ? e.json.error_code : null);
        dispatch(action);
      }
    });
});

export const cancelUpload = upload => ((dispatch) => {
  let action = removeUpload(upload);
  dispatch(action);
  if (upload.xhr) {
    /* eslint-disable no-param-reassign */
    upload.xhr.upload.onprogress = () => {};
    /* eslint-enable */
    upload.xhr.abort();
  }
  if (upload.video) {
    action = processVideoRemoval(upload.video);
    dispatch(action);
  }
});

export const reqCountryList = () => (dispatch => ApiUtil.get('/api/series/countries')
  .then((response) => {
    const action = receiveCountries(response.series_countries);
    dispatch(action);
  })
  .catch((ex) => {
    LogUtil.debug(`Request series country failed, ${ex.statusText || ''}`);
  })
);

const receiveCountries = countries => ({
  type: types.RECEIVE_COUNTRIES,
  countries,
});


export const processRecognition = (videoId, modelIDs, faceModel) => ((dispatch) => {
  if (!videoId || !modelIDs) {
    throw new Error("Neither 'video_id' nor 'modelIDs' are not defined.");
  }

  const data = new FormData();
  data.append('video_id', videoId);
  if (typeof modelIDs === 'string') {
    data.append('model_ids', modelIDs);
  }
  if (Array.isArray(modelIDs)) {
    data.append('model_ids', modelIDs.join());
  }
  if (faceModel) {
    data.append('face_model', faceModel);
  }

  return ApiUtil.post('/api/recognitions', data)
    .then((response) => {
      let action = receiveVideo(response);
      dispatch(action);
      action = receiveStatus(response);
      dispatch(action);
      dispatch(createRecognitionSuccess());
    })
    .catch((ex) => {
      LogUtil.debug(`Create recognition request failed, ${ex.message || ''}`);
    });
});

export const processRecognitionRetry = videoId => ((dispatch) => {
  const data = new FormData();
  data.append('video_ids', videoId);
  return ApiUtil.post('/api/re_recognitions', data)
    .then(() => {
      dispatch(createRecognitionSuccess());
    })
    .catch((ex) => {
      LogUtil.debug(`Retry recognition request failed, ${ex.message || ''}`);
    });
});

const createRecognitionSuccess = () => ({
  type: types.CREATE_RECOGNITION_SUCCESS,
});

export const receiveStatus = video => ({
  type: types.RECEIVE_STATUS,
  video,
});

export const processStatusList = (status, limit, reverse) => ((dispatch) => {
  const url = `/api/status?status=${status}${limit ? `&limit=${limit}` : ''}${reverse ? '&reverse=true' : ''}`;
  return ApiUtil.get(url)
    .then((response) => {
      const action = receiveStatusList(status, response);
      dispatch(action);
    });
});

const receiveStatusList = (status, response) => ({
  type: types.RECEIVE_STATUS_LIST,
  status,
  response,
});
