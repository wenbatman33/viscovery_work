/**
 * Created by amdis on 2017/5/11.
 */
import { bindQueryString } from 'utils/urlUtil';
import { ApiUtil } from '../../utils';
import { addQueryParam, hasValue } from '../utils';


const endpoint = '/api/videos';

export const getVideosBySeriesId = (seriesId, isBrief = true) => {
  let url = `${endpoint}`;

  if (hasValue(seriesId)) {
    url = addQueryParam(url, 'series_id', seriesId);
  }

  if (hasValue(isBrief)) {
    url = addQueryParam(url, 'is_brief', isBrief ? 1 : 0);
  }

  return ApiUtil.get(url);
};

export const getAllVideos = (isBrief = true, isOnline = true, advancedConfig = {}) => {
  let url = '/tag2ad/webapi/proxy/v1/vsp/video';
  let queryStringObj = {};

  if (hasValue(isBrief)) {
    queryStringObj = {
      ...queryStringObj,
      is_brief: isBrief ? 1 : 0,
    };
  }

  if (hasValue(isOnline)) {
    queryStringObj = {
      ...queryStringObj,
      on_air: isOnline ? 1 : 0,
    };
  }

  queryStringObj = {
    ...queryStringObj,
    ...advancedConfig,
  };

  url = bindQueryString(url)(queryStringObj);

  return ApiUtil.get(url);
};
