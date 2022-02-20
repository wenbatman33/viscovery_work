/**
 * Created by amdis on 2017/4/7.
 */
import { ApiUtil } from '../../utils';

const endpoint = '/tag2ad/webapi/ads/v1/search';

export const adChanceSearch = (payload) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  return ApiUtil.post(endpoint, JSON.stringify(payload), headers);
};

