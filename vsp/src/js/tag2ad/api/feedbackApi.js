import { ApiUtil } from '../../utils';

const endpointIndependent = '/hrsapi/webapi';
const endpoint = '/feedback';

const jsonHeaders = {
  'Content-Type': 'application/json',
};

export const feedbackToHrsApi = payload =>
  ApiUtil.post(
    `${endpointIndependent}${endpoint}/1/brand`,
    JSON.stringify(payload),
    jsonHeaders
  );
