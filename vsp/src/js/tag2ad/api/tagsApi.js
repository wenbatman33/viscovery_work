/**
 * Created by amdis on 2017/4/7.
 */
import { ApiUtil } from '../../utils';
import { addQueryParam, hasValue } from '../utils';

const endpoint = '/api/tags';

export const requestMappingOfTags = (locale, keyword, modelId, classId, brandId, brandInUse,
                                     classInUse) => {
  let url = endpoint;
  url = addQueryParam(url, 'only_fitamos', true);

  if (hasValue(locale)) {
    url = addQueryParam(url, 'lang', locale);
  }

  if (hasValue(modelId)) {
    url = addQueryParam(url, 'model_id', modelId);
  }

  if (hasValue(classId)) {
    url = addQueryParam(url, 'class_id', classId);
  }

  if (hasValue(brandId)) {
    url = addQueryParam(url, 'brand_id', brandId);
  }

  if (hasValue(brandInUse)) {
    url = addQueryParam(url, 'brand_in_use', brandInUse ? 1 : 0);
  }

  if (hasValue(classInUse)) {
    url = addQueryParam(url, 'class_in_use', classInUse ? 1 : 0);
  }

  if (hasValue(keyword)) {
    url = addQueryParam(url, 'keyword', keyword);
  }

  return ApiUtil.get(url);
};


export const requestAllTagBrands = (keyword, inUse, classId, modelId) => {
  let url = `${endpoint}/brands`;

  if (hasValue(keyword)) {
    url = addQueryParam(url, 'keyword', keyword);
  }

  if (hasValue(inUse)) {
    url = addQueryParam(url, 'in_use', inUse ? 1 : 0);
  }

  if (hasValue(classId)) {
    url = addQueryParam(url, 'class_id', classId);
  }

  if (hasValue(modelId)) {
    url = addQueryParam(url, 'model_id', modelId);
  }

  return ApiUtil.get(url);
};
