import { ApiUtil } from 'utils';

export const createUser = (result) => {
  const data = new FormData();
  data.append('account', result.username);
  // data.append('roles', result.roles);
  data.append('password', result.password);
  return ApiUtil.post('/api/users', data);
};

export const createGroup = (group) => {
  const data = new FormData();
  data.append('group_name', group.group_name);
  data.append('country', group.country);
  data.append('start_time', group.start_time);
  data.append('expire_time', group.expire_time);
  data.append('max_upload', group.max_upload);
  data.append('is_vip', group.is_vip);
  data.append('contact_name', group.contact_name);
  data.append('contact_gender', group.contact_gender);
  data.append('telephone', group.telephone);
  data.append('contact_email', group.contact_email);
  data.append('contact_company', group.contact_company);
  data.append('memo', group.memo);
  data.append('is_vip', group.is_vip);
  data.append('enable_hrs', group.enable_hrs);
  ApiUtil.post('/api/groups', data)
    .then(() => console.log('send'))
    .catch(err => console.log(err));
};

export const requestSingleUser = (uid) => {
  ApiUtil.get(`/api/users/${uid}`)
    .then(res => console.log(res))
    .catch(err => console.log(err));
};
