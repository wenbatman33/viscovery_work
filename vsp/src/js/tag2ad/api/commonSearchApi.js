/**
 * Created by amdis on 2017/4/7.
 */
import { ApiUtil } from '../../utils';

const endpoint = '/commonsearch';

export const seriesKeyword = keyword => (
  ApiUtil.get(`${endpoint}/series?keyword=${keyword}`)
);
