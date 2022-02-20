/**
 * Created by amdis on 2017/8/1.
 */
import { ApiUtil } from '../../utils';

export const login = (account, pwd) => {
  const data = new FormData();

  data.append('account', account);
  data.append('password', pwd);

  return ApiUtil.post('/login', data);
};

export const logout = () => ApiUtil.get('/logout');
