import { ApiUtil } from '../../utils';
import { addQueryParam, hasValue } from '../utils';

const endpoint = '/tag2ad/webapi/ads/v1/filters';

export const createFilter = (filterName, filterContentStr) => {
  const data = new FormData();
  data.append('filter_name', filterName);
  data.append('filter_content', filterContentStr);

  return ApiUtil.post(endpoint, data);
};

export const deleteFilter = filterId => ApiUtil.erase(`${endpoint}/${filterId}`);

export const requestAllFilters = (locale) => {
  let url = endpoint;

  if (hasValue(locale)) {
    url = addQueryParam(url, 'lang', locale);
  }

  return ApiUtil.get(url);
};

export const requestFilter = (filterId, locale) => {
  let url = `${endpoint}/${filterId}`;
  if (hasValue(locale)) {
    url = addQueryParam(url, 'lang', locale);
  }

  return ApiUtil.get(url);
};

export const updateFilter = (filterId, newName, newContentStr) => {
  const data = new FormData();
  data.append('filter_name', newName);
  data.append('filter_content', newContentStr);

  return ApiUtil.patch(`${endpoint}/${filterId}`, data);
};
