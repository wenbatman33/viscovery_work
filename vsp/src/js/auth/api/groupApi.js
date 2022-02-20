/**
 * Created by amdis on 2017/8/1.
 */
import { ApiUtil } from '../../utils';

export const getAllGroupMapping = () => ApiUtil.get('/api/groups_mapping');
