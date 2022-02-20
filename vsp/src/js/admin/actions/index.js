import {
  ApiUtil,
  LogUtil,
  routerUtil,
} from 'utils';

import * as types from './types';
import { NAME } from '../constants';
import * as adsApi from '../apis/adsApi';

export const receiveUsers = users => (
  {
    type: types.RECEIVE_USERS,
    users,
  }
);

export const requestUsers = () =>
  (dispatch) => {
    ApiUtil.get('/api/users')
      .then(users => users.users)
      .then((users) => {
        dispatch(receiveUsers(users));
      })
      .catch((err) => {
        LogUtil.debug(err);
      });
  };

export const receiveRoleOptions = roleOptions => (
  {
    type: types.RECEIVE_ROLE_OPTIONS,
    roleOptions,
  }
);

export const requestRoleOptions = () =>
  (dispatch) => {
    ApiUtil.get('/api/roles')
      .then(r => r.roles)
      .then((roles) => {
        dispatch(receiveRoleOptions(roles));
      })
      .catch((err) => {
        LogUtil.debug(err);
      });
  };

export const receiveGroups = groups => (
  {
    type: types.RECEIVE_GROUPS,
    groups,
  }
);

export const requestGroups = () =>
  (dispatch) => {
    ApiUtil.get('/api/groups')
      .then(result => result.groups)
      .then((groups) => {
        dispatch(receiveGroups(groups));
      })
      .catch((e) => {
        LogUtil.debug(e);
      });
  };

export const receiveCountries = countryInfos => (
  {
    type: types.RECEIVE_COUNTRIES,
    country_infos: countryInfos,
  }
);

export const requestCountries = () =>
  (dispatch) => {
    ApiUtil.get('/api/country_infos')
      .then(result => result.country_infos)
      .then((countryInfos) => {
        dispatch(receiveCountries(countryInfos));
      })
      .catch((e) => {
        LogUtil.debug(e);
      });
  };

export const createGroup = formResult =>
  (dispatch) => {
    const data = new FormData();
    data.append('group_name', formResult.groupName);
    if (formResult.country) {
      data.append('country', formResult.country);
    }
    data.append('start_time', formResult.startTime);
    data.append('expire_time', formResult.expireTime);
    data.append('max_upload', formResult.maxUpload);
    data.append('is_vip', formResult.isVip);
    if (formResult.contactName !== '') {
      data.append('contact_name', formResult.contactName);
    }

    if (formResult.contactGender) {
      data.append('contact_gender', formResult.contactGender);
    }

    if (formResult.contactTelephone !== '') {
      data.append('contact_telephone', formResult.contactTelephone);
    }

    if (formResult.contactEmail !== '') {
      data.append('contact_email', formResult.contactEmail);
    }

    if (formResult.contactCompany !== '') {
      data.append('contact_company', formResult.contactCompany);
    }

    if (formResult.memo !== '') {
      data.append('memo', formResult.memo);
    }

    if (formResult.businessModel !== undefined && formResult.businessModel !== null) {
      data.append('ad_business_model_id', formResult.businessModel);
    }

    if (formResult.platform !== undefined && formResult.platform !== null) {
      data.append('ad_platform_id', formResult.platform);
    }

    if (formResult.videoKey !== undefined && formResult.videoKey !== null) {
      data.append('ad_video_key_id', formResult.videoKey);
    }

    if (formResult.customAdCategory !== undefined && formResult.customAdCategory !== null) {
      data.append('custom_ad_category', formResult.customAdCategory);
    }

    if (formResult.customAdType !== undefined && formResult.customAdType !== null) {
      data.append('custom_ad_type', formResult.customAdType);
    }

    data.append('is_vip', formResult.isVip);
    data.append('enable_hrs', formResult.enableHrs);
    data.append('is_notify', formResult.isNotify);
    return ApiUtil.post('/api/groups', data)
      .then(() => dispatch(requestGroups()))
      .then(() => routerUtil.pushHistory(`/${NAME}/group`))
      .catch(err => LogUtil.debug(err));
  };

export const updateGroup = (groupId, formResult) =>
  (dispatch) => {
    const data = new FormData();
    data.append('group_name', formResult.groupName);
    if (formResult.country !== null) {
      data.append('country', formResult.country);
    }
    data.append('start_time', formResult.startTime);
    data.append('expire_time', formResult.expireTime);
    data.append('max_upload', formResult.maxUpload);

    if (formResult.contactName !== null) {
      data.append('contact_name', formResult.contactName);
    }

    if (formResult.contactGender !== null) {
      data.append('contact_gender', formResult.contactGender);
    }

    if (formResult.contactTelephone !== null) {
      data.append('contact_telephone', formResult.contactTelephone);
    }

    if (formResult.contactEmail !== null) {
      data.append('contact_email', formResult.contactEmail);
    }

    if (formResult.contactCompany !== null) {
      data.append('contact_company', formResult.contactCompany);
    }

    if (formResult.memo !== null) {
      data.append('memo', formResult.memo);
    }

    if (formResult.businessModel !== undefined && formResult.businessModel !== null) {
      data.append('ad_business_model_id', formResult.businessModel);
    }

    if (formResult.platform !== undefined && formResult.platform !== null) {
      data.append('ad_platform_id', formResult.platform);
    }

    if (formResult.videoKey !== undefined && formResult.videoKey !== null) {
      data.append('ad_video_key_id', formResult.videoKey);
    }

    if (formResult.customAdCategory !== undefined && formResult.customAdCategory !== null) {
      data.append('custom_ad_category', formResult.customAdCategory);
    }

    if (formResult.customAdType !== undefined && formResult.customAdType !== null) {
      data.append('custom_ad_type', formResult.customAdType);
    }

    data.append('is_vip', formResult.isVip);
    data.append('enable_hrs', formResult.enableHrs);
    data.append('is_notify', formResult.isNotify);
    return ApiUtil.patch(`/api/groups/${groupId}`, data)
      .then(() => dispatch(requestGroups()))
      .then(() => routerUtil.pushHistory(`/${NAME}/group`))
      .catch(err => LogUtil.debug(err));
  };

export const createUser = formResult =>
  () => {
    const data = new FormData();
    data.append('username', formResult.username);
    data.append('password', formResult.password);
    data.append('account', formResult.account);
    data.append('gender', formResult.gender);

    if (formResult.memo !== '') {
      data.append('memo', formResult.memo);
    }

    if (formResult.company !== '') {
      data.append('company', formResult.company);
    }

    if (formResult.email !== '') {
      data.append('email', formResult.email);
    }

    if (formResult.countryId) {
      data.append('country_id', formResult.countryId);
    }

    if (formResult.telNumber !== '') {
      data.append('tel_number', formResult.telNumber);
    }
    data.append('permissions', JSON.stringify(formResult.permissions));
    return ApiUtil.post('/api/users', data)
      .then(() => requestUsers())
      .then(() => routerUtil.pushHistory(`/${NAME}/user`))
      .catch(err => LogUtil.debug(err));
  };

export const updateUser = (userId, formResult) =>
  () => {
    const data = new FormData();
    data.append('username', formResult.username);

    if (formResult.password !== null) {
      data.append('password', formResult.password);
    }
    data.append('account', formResult.account);
    data.append('gender', formResult.gender);

    if (formResult.memo !== null) {
      data.append('memo', formResult.memo);
    }

    if (formResult.company !== null) {
      data.append('company', formResult.company);
    }

    if (formResult.email !== null) {
      data.append('email', formResult.email);
    }

    if (formResult.countryId) {
      data.append('country_id', formResult.countryId);
    }

    if (formResult.telNumber !== null) {
      data.append('tel_number', formResult.telNumber);
    }
    data.append('permissions', JSON.stringify(formResult.permissions));
    return ApiUtil.patch(`/api/users/${userId}`, data)
      .then(() => requestUsers())
      .then(() => routerUtil.pushHistory(`/${NAME}/user`))
      .catch(err => LogUtil.debug(err));
  };

export const getBriefGroupsSuccess = briefGroups => (
  {
    type: types.GET_BRIEF_GROUPS_SUCCESS,
    briefGroups,
  }
);

export function requestBriefGroups() {
  return dispatch => (
    ApiUtil.get('/api/groups_mapping')
      .then((res) => {
        dispatch(getBriefGroupsSuccess(res.groups));
      })
      .catch((ex) => {
        LogUtil.error('get groups failed');
        LogUtil.exception(ex);
      })
  );
}

export const requestAdSetting = () => dispatch => (
  adsApi.getAdSetting()
    .then(res => res.response_data)
    .then((data) => {
      dispatch(
        {
          type: types.GET_AD_SETTING,
          payload: data,
        }
      );
    })
    .catch((ex) => {
      LogUtil.error(`get ad setting failed, ex=${ex}`);
      throw ex;
    })
);
