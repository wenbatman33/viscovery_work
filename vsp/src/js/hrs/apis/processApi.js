import {
  ApiUtil,
} from 'utils';

const endpoint = '/api/hrs/processes';

export const postProcessApi = formData =>
  ApiUtil.post(endpoint, formData);

export const finishProcessApi = processId =>
  ApiUtil.patch(`${endpoint}/${processId}/finish`);
