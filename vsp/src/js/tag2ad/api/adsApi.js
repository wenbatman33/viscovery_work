/**
 * Created by amdis on 2017/4/7.
 */
import { ApiUtil } from 'utils';
import {
  objectToForm,
} from 'utils/dataTypeUtil';

import {
  addQueryParam,
  hasValue,
  dateToQueryString,
} from '../utils';

const endpoint = '/api/ads';
const endpointIndependent = '/tag2ad/webapi/ads';

export const createAd = (ad) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  const payload = {};

  if (Array.isArray(ad)) {
    payload.ads = ad;
  } else if (typeof ad === 'object') {
    payload.ads = [ad];
  } else {
    throw new Error('Expect param "ad" to be either array or object');
  }

  return ApiUtil.post(`${endpointIndependent}/v1/ad`, JSON.stringify(payload), headers);
};

export const createWithSearchResult = (campaignId, adFilterId, adFormId, filterContent,
                                       videoMap, filterIDs) => {
  if (!hasValue(campaignId)) {
    throw new Error('param "campaignId" is required.');
  }

  if (!hasValue(adFilterId)) {
    throw new Error('param "adFilterId" must be provided.');
  }

  if (!hasValue(adFormId)) {
    throw new Error('param "adFormId" must be provided.');
  }

  const headers = {
    'Content-Type': 'application/json',
  };

  const payload = {};
  payload.ad_campaign_id = campaignId;

  payload.ad_filter_id = adFilterId;
  payload.ad_form_id = adFormId;

  if (hasValue(filterContent) && typeof filterContent === 'object') {
    payload.filter_content = filterContent;
  }

  payload.video_map = videoMap || {};
  payload.filter_ids = filterIDs || [];

  return ApiUtil.post(`${endpointIndependent}/v1/ad`, JSON.stringify(payload), headers);
};

export const deleteAd = id => (
  ApiUtil.erase(`${endpointIndependent}/v1/ad/${id}`)
);

export const deleteAds = (campaignId, adIdArray, videoIds, filterIDs, startTime, endTime,
  isAll = false) => {
  if (!hasValue(campaignId)) {
    throw new Error('campaignId is required');
  }

  const url = addQueryParam(`${endpointIndependent}/v1/ad`, 'campaign_id', campaignId);
  const data = {};

  if (isAll) {
    data.all = 1;
  }

  if (!isAll && hasValue(adIdArray)) {
    data.ad_ids = JSON.stringify(adIdArray);
  }

  if (isAll && hasValue(videoIds) && videoIds.length) {
    data.video_ids = JSON.stringify(videoIds);
  }

  if (isAll && hasValue(filterIDs) && filterIDs.length > 0) {
    data.filter_ids = JSON.stringify(filterIDs);
  }

  if (isAll && hasValue(startTime)) {
    if (startTime instanceof Date) {
      data.start_time = dateToQueryString(startTime);
    } else {
      data.start_time = startTime;
    }
  }

  if (isAll && hasValue(endTime)) {
    if (endTime instanceof Date) {
      data.end_time = dateToQueryString(endTime);
    } else {
      data.end_time = endTime;
    }
  }

  return ApiUtil.erase(url, objectToForm(data));
};


export const getCategories = locale => (
  ApiUtil.get(`/tag2ad/webapi/ads/v1/categories?lang=${locale}`)
);

export const getForms = () => (
  ApiUtil.get(`${endpointIndependent}/v1/ad_form`)
);

export const getRatios = () => (
  ApiUtil.get(`${endpoint}/ratio`)
);

export const updateAd = (id, contentStr) => {
  const data = new FormData();
  data.append('content', contentStr);

  return ApiUtil.patch(`${endpointIndependent}/v1/ad/${id}`, data);
};

export const updateAds =
  (campaignId, adsContentStr, all, videoIDs, filterIDs, startTime, endTime, content) => {
    if (!hasValue(campaignId)) {
      throw new Error('campaignId is required');
    }

    const data = {};
    const url = addQueryParam(`${endpointIndependent}/v1/ad`, 'campaign_id', campaignId);
    const updateAll = hasValue(all) && typeof all === 'boolean' && all;

    if (!updateAll && hasValue(adsContentStr) && typeof adsContentStr === 'string') {
      data.ads = adsContentStr;
      return ApiUtil.patch(url, objectToForm(data));
    }

    if (updateAll) {
      if (!hasValue(content)) {
        throw new Error('Param "content" must be given');
      }
      data.all = updateAll ? 1 : 0;
      data.content = JSON.stringify(content);
    }

    if (updateAll && hasValue(videoIDs)) {
      if (Array.isArray(videoIDs) && videoIDs.length > 0) {
        data.video_ids = JSON.stringify(videoIDs);
      }

      if (!Array.isArray(videoIDs)) {
        data.video_ids = videoIDs;
      }
    }

    if (updateAll && hasValue(filterIDs)) {
      if (Array.isArray(filterIDs) && filterIDs.length > 0) {
        data.filter_ids = JSON.stringify(filterIDs);
      }

      if (!Array.isArray(filterIDs)) {
        data.filter_ids = filterIDs;
      }
    }

    if (updateAll && hasValue(startTime)) {
      if (startTime instanceof Date) {
        data.start_time = dateToQueryString(startTime);
      } else {
        data.start_time = startTime;
      }
    }

    if (updateAll && hasValue(endTime)) {
      if (endTime instanceof Date) {
        data.end_time = dateToQueryString(endTime);
      } else {
        data.end_time = endTime;
      }
    }

    return ApiUtil.patch(url, objectToForm(data));
  };


export const getAdsV2 = (campaignId, videoIds, subCategoryIds, filterIds, display = 0,
                         offset, limit, startTime, endTime) => {
  if (!hasValue(campaignId)) {
    throw new Error('campaignId is required');
  }

  let url = addQueryParam('/tag2ad/webapi/ads/v1/ad', 'campaign_id', campaignId);

  if (hasValue(videoIds)) {
    if (Array.isArray(videoIds) && videoIds.length > 0) {
      url = addQueryParam(url, 'video_ids', JSON.stringify(videoIds));
    }

    if (!Array.isArray(videoIds)) {
      url = addQueryParam(url, 'video_ids', videoIds);
    }
  } else {
    url = addQueryParam(url, 'all', 1);
  }

  if (hasValue(subCategoryIds)) {
    if (Array.isArray(subCategoryIds) && subCategoryIds.length > 0) {
      url = addQueryParam(url, 'subcategory_ids', JSON.stringify(subCategoryIds));
    }

    if (!Array.isArray(subCategoryIds)) {
      url = addQueryParam(url, 'subcategory_ids', subCategoryIds);
    }
  }

  if (hasValue(filterIds)) {
    if (Array.isArray(filterIds) && filterIds.length > 0) {
      url = addQueryParam(url, 'filter_ids', JSON.stringify(filterIds));
    }

    if (!Array.isArray(filterIds)) {
      url = addQueryParam(url, 'filter_ids', filterIds);
    }
  }

  if (hasValue(display)) {
    url = addQueryParam(url, 'display', display);
  }

  if (hasValue(offset)) {
    url = addQueryParam(url, 'offset', offset);
  }

  if (hasValue(limit)) {
    url = addQueryParam(url, 'limit', limit);
  }

  if (hasValue(startTime)) {
    if (startTime instanceof Date) {
      url = addQueryParam(url, 'start_time', dateToQueryString(startTime));
    } else {
      url = addQueryParam(url, 'start_time', startTime);
    }
  }

  if (hasValue(endTime)) {
    if (endTime instanceof Date) {
      url = addQueryParam(url, 'end_time', dateToQueryString(endTime));
    } else {
      url = addQueryParam(url, 'end_time', endTime);
    }
  }

  return ApiUtil.get(url);
};

export const downloadAds = (campaignId, isAll = false, adIDs, filterIDs, startTime, endTime) => {
  if (!hasValue(campaignId)) {
    throw new Error('campaignId is required');
  }

  const url = '/tag2ad/webapi/vsp/ads/v1/download';
  const payload = { campaign_id: campaignId };

  if (isAll) {
    payload.all = 1;
  }

  if (hasValue(adIDs)) {
    if (Array.isArray(adIDs) && adIDs.length > 0) {
      payload.ad_ids = JSON.stringify(adIDs);
    }

    if (typeof adIDs === 'string') {
      payload.ad_ids = adIDs;
    }
  }

  if (hasValue(filterIDs)) {
    if (Array.isArray(filterIDs) && filterIDs.length > 0) {
      payload.filter_ids = JSON.stringify(filterIDs);
    }

    if (typeof filterIDs === 'string') {
      payload.filter_ids = filterIDs;
    }
  }

  if (hasValue(startTime)) {
    if (startTime instanceof Date) {
      payload.start_time = dateToQueryString(startTime);
    } else {
      payload.start_time = startTime;
    }
  }

  if (hasValue(endTime)) {
    if (endTime instanceof Date) {
      payload.end_time = dateToQueryString(endTime);
    } else {
      payload.end_time = endTime;
    }
  }

  return ApiUtil.post(url, objectToForm(payload));
};

export const exportAds = (campaignId, isAll = false, adIDs, filterIDs, startTime, endTime) => {
  if (!hasValue(campaignId)) {
    throw new Error('campaignId is required');
  }

  const url = '/tag2ad/webapi/vsp/ads/v1/export';
  const data = new FormData();
  data.append('campaign_id', campaignId);

  if (isAll) {
    data.append('all', 1);
  }

  if (hasValue(adIDs)) {
    if (Array.isArray(adIDs) && adIDs.length > 0) {
      data.append('ad_ids', JSON.stringify(adIDs));
    }

    if (typeof adIDs === 'string') {
      data.append('ad_ids', adIDs);
    }
  }

  if (hasValue(filterIDs)) {
    if (Array.isArray(filterIDs) && filterIDs.length > 0) {
      data.append('filter_ids', JSON.stringify(filterIDs));
    }

    if (typeof filterIDs === 'string') {
      data.append('filter_ids', filterIDs);
    }
  }

  if (hasValue(startTime)) {
    if (startTime instanceof Date) {
      data.append('start_time', dateToQueryString(startTime));
    } else {
      data.append('start_time', startTime);
    }
  }

  if (hasValue(endTime)) {
    if (endTime instanceof Date) {
      data.append('end_time', dateToQueryString(endTime));
    } else {
      data.append('end_time', endTime);
    }
  }

  return ApiUtil.post(url, data);
};
