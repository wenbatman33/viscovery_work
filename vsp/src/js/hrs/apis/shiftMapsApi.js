import {
  ApiUtil,
} from 'utils';

const endpoint = '/api/hrs/shift_map';

export const getAllShiftMapApi = () =>
  ApiUtil.get(`${endpoint}`);

export const postOneShiftMapApi = formData =>
  ApiUtil.post(`${endpoint}`, formData);

export const patchOneShiftMapApi = shiftMapId => formData =>
  ApiUtil.patch(`${endpoint}/${shiftMapId}`, formData);

export const deleteOneShiftMapApi = shiftMapId =>
  ApiUtil.erase(`${endpoint}/${shiftMapId}`);
