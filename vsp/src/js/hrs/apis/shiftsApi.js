import {
  ApiUtil,
} from 'utils';

const endpoint = '/api/hrs/shift';

export const getAllShiftApi = () =>
  ApiUtil.get(`${endpoint}`);

export const patchOneShiftApi = hrsShiftId => form =>
  ApiUtil.patch(`${endpoint}/${hrsShiftId}`, form);
