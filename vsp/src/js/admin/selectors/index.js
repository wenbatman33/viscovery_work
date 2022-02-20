import {
  NAME,
} from '../constants';

import { LOCALE_ZH_CN, LOCALE_ZH_TW } from '../../app/constants';
import { getLocale } from '../../app/selectors';
import * as helper from './helper';

export const getUsers = state => state[NAME].users;
export const getRoleOptions = state => state[NAME].roleOptions.map(role => ({
  value: role.id,
  label: (getLocale(state) === LOCALE_ZH_TW && role.name_zh_tw)
    || (getLocale(state) === LOCALE_ZH_CN && role.name_zh_cn)
    || role.name,
}));
export const getGroups = state => state[NAME].groups;
export const getCountries = state => state[NAME].countries;
export const getCountriesOptions = state =>
  state[NAME].countries.map(info => (
    {
      value: info.id,
      label: info.country_zh_tw,
    }
  ));
export const getContactOptions = state =>
  state[NAME].countries.map(contact => ({
    value: contact.id,
    label: `${contact.country_zh_tw} + ${contact.country_code}`,
  }));

export const getGroupsOptions = state => state[NAME].briefGroups.map(bg => ({
  value: bg.id,
  label: bg.name,
}));

export const getAdVideoKeyOptions = state => (
  helper.responseDictToOptions(state[NAME].adSettings.video_key)
);

export const getAdModelOptions = state => (
  helper.responseDictToOptions(state[NAME].adSettings.business_model)
);

export const getAdPlatformOptions = state => (
  helper.responseDictToOptions(state[NAME].adSettings.ad_platform)
);

export const getAdCustomCategoryOptions = state => (
  helper.responseDictToOptions(state[NAME].adSettings.custom_ad_category)
);

export const getAdCustomTypeOptions = state => (
  helper.responseDictToOptions(state[NAME].adSettings.custom_ad_type)
);
