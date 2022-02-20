/**
 * Created by amdis on 2017/7/25.
 */
import { ApiUtil } from 'utils';

export const getAdSetting = () => (
  ApiUtil.get('/tag2ad/webapi/ads/v1/ad_setting')
);
