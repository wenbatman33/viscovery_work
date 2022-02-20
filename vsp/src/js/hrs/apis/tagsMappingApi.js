import { normalize } from 'normalizr';

import {
  ApiUtil,
} from 'utils';

import {
  bindQueryString,
} from 'utils/urlUtil';

import tagsMappingSchema from '../schemas/tagsMappingSchema';

const endpoint = '/api/tags';

export const requestTagsMappingApi = lang =>
  ApiUtil.get(
    bindQueryString(endpoint)({
      lang,
      brand_in_use: 'all',
      class_in_use: 'all',
      only_fitamos: true,
    })
  )
    .then(r => ({
      models: r.models,
    }))
    .then(r => normalize(r, tagsMappingSchema));
