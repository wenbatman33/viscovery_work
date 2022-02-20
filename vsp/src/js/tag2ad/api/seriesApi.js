/**
 * Created by amdis on 2017/4/10.
 */
import { bindQueryString } from 'utils/urlUtil';
import { hasValue } from '../utils';
import { ApiUtil } from '../../utils';

const endpoint = '/api/series';

export const getAllSeries = (isOnline = true, advancedFilter) => {
  let url = endpoint;
  let queryStringObj = {};

  if (hasValue(isOnline)) {
    queryStringObj = {
      ...queryStringObj,
      on_air: isOnline ? 1 : 0,
    };
  }

  queryStringObj = {
    ...queryStringObj,
    ...advancedFilter,
  };

  url = bindQueryString(url)(queryStringObj);

  return ApiUtil.get(url);
};
