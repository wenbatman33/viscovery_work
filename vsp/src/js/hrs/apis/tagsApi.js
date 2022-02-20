import {
  ApiUtil,
} from 'utils';

import {
  bindQueryString,
} from 'utils/urlUtil';

const endpoint = '/api/hrs/tags';

export const requestBrandBriefApi = (videoId, modelId, brandId) =>
  ApiUtil.get(
    bindQueryString(endpoint)({
      brief: true,
      video_id: videoId,
      model_id: modelId,
      brand_id: brandId,
    })
  )
    .then(r => r.result);

export const requestTagsApi = (videoId, modelId, brandId) =>
  ApiUtil.get(
    bindQueryString(endpoint)({
      brief: false,
      video_id: videoId,
      model_id: modelId,
      brand_id: brandId,
    })
  )
    .then(r => r.result);

export const patchTagsApi = formData =>
  ApiUtil.patch(endpoint, formData);
