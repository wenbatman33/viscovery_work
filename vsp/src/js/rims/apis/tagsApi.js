import { ApiUtil } from 'utils';
import { bindQueryString } from 'utils/urlUtil';

import { normalize } from 'normalizr';

import modelListSchema from '../schemas/modelListSchema';

const endpoint = '/api/tags';

export const requestModelDataApi = (classInUse, brandInUse) =>
  ApiUtil.get(
    bindQueryString(endpoint)({
      class_in_use: classInUse,
      brand_in_use: brandInUse,
    })
  )
    .then((responseData) => {
      const { models, total_count, total_recognizable_count } = responseData;

      return {
        models,
        total_count,
        recognizableCount: total_recognizable_count,
      };
    }).then((normedYetData) => {
      const modelPageData = normedYetData;
      modelPageData.normalizedModelData = normalize(modelPageData, modelListSchema);

      return modelPageData;
    });

export const uploadCsvApi = csvFormData =>
  ApiUtil.post('/api/tags/upload', csvFormData)
  .then(responseData => responseData.brands);

export const createNewBrandApi = brandSubmitData =>
  ApiUtil.post(`${endpoint}/brands`, brandSubmitData)
    .then(responseData => responseData.brand);

export const editBrandApi = editedBrandData =>
  ApiUtil.patch(`${endpoint}/brands/${editedBrandData.get('id')}`, editedBrandData)
    .then(responseData => responseData.results);
