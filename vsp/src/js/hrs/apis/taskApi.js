import {
  ApiUtil,
} from 'utils';

const endpoint = '/api/hrs/tasks';
const independentPoint = '/hrsapi/webapi/task/1';

const jsonHeaders = {
  'Content-Type': 'application/json',
};

export const getOneTaskApi = taskId =>
  ApiUtil.get(`${endpoint}/${taskId}`);

export const getAllTaskApi = () =>
  ApiUtil.get(`${endpoint}`);

export const startTaskApi = taskId =>
  ApiUtil.patch(`${endpoint}/${taskId}/start`);

export const finishTaskApi = payload =>
  ApiUtil.patch(`${independentPoint}/finish`, JSON.stringify(payload), jsonHeaders);

export const releaseTaskApi = formData =>
  ApiUtil.patch(`${endpoint}/release`, formData);

export const releaseOneTaskApi = taskId =>
  ApiUtil.patch(`${endpoint}/${taskId}/release`);

export const patchOneTaskApi = taskId => formData =>
  ApiUtil.patch(`${endpoint}/${taskId}`, formData);
