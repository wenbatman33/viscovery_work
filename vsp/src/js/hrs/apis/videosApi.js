import {
  ApiUtil,
} from 'utils';

const endpoint = '/api/hrs/videos';

export const getAllVideosApi = () =>
  ApiUtil.get(`${endpoint}`);

export const getOneVideoApi = videoId =>
  ApiUtil.get(`${endpoint}/${videoId}`);

export const patchVideoApi = videoId => formData =>
  ApiUtil.patch(`${endpoint}/${videoId}`, formData);
