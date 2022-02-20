/**
 * Created by amdis on 2017/8/1.
 */
import { ApiUtil } from '../../utils';

export const getAllRoles = () => ApiUtil.get('/api/roles');
