import {
  ApiUtil,
} from 'utils';

import {
  bindQueryString,
} from 'utils/urlUtil';

const endpoint = '/api/hrs/dispatch';
const independentPoint = '/hrsapi/webapi/task/1/dispatch';

const jsonHeaders = {
  'Content-Type': 'application/json',
};

export const getDispatchApi = userId =>
  ApiUtil.get(
    bindQueryString(endpoint)({
      user_id: userId,
    })
  );

export const patchDispatchApi = payload =>
  ApiUtil.post(independentPoint, JSON.stringify(payload), jsonHeaders);
