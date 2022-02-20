/**
 * Created Date : 2016/9/22
 * Copyright (c) Viscovery.co
 * Author : Amdis Liu <amdis.liu@viscovery.co>
 * Contributor :
 * Description :
 */
import R from 'ramda';

import * as types from './types';
import { LogUtil } from '../utils';
import { Series, Filter, AdForm, AdCategory } from './models';
import { API_LOCALE } from './constants';
import {
  adsApi,
  adSearchApi,
  filtersApi,
  tagsApi,
  seriesApi,
  videosApi,
  campaignApi,
  advancedApi,
} from './api';

import { toChanceSearchPayload } from './utils';
import {
  offsetToPageNum,
} from './components/AdPodManagement/helper';

const receiveAdChances = (results, videoCount, adCount, params) => ({
  type: types.RECEIVE_AD_CHANCES,
  results,
  videoCount,
  adCount,
  params,
});


const queryTags = (locale = API_LOCALE.ZH_TW, modelId, classId, brandId) =>
  tagsApi.requestMappingOfTags(locale, null, modelId, classId, brandId)
    .then(res => res.models)
    .catch((ex) => {
      LogUtil.debug(`Query tags failed, statusText = ${ex}`);
      throw ex;
    });

export const queryAllTags = (locale = API_LOCALE.ZH_TW) => (dispatch =>
  queryTags(locale)
    .then((data) => {
      dispatch({
        type: types.RECEIVE_TAGS,
        payload: data,
      });
      let allBrands = [];
      data.forEach((model) => {
        model.classes.forEach((cls) => {
          allBrands = [...allBrands, ...cls.brands];
        });
      });
      dispatch({
        type: types.RECEIVE_BRAND_LIST,
        brands: allBrands,
      });
    })
    .catch((ex) => {
      dispatch(
        {
          type: types.REQ_FAIL,
          message: `Request tags failed, ex = ${ex}`,
        }
      );
    })
);

export const queryAdChance = (isAll = false, videos, filterOptions, config, pageNum, countsPerPage,
  searchHash, advancedFilter = {}) =>
  ((dispatch) => {
    const payload = toChanceSearchPayload(
      isAll ? null : videos,
      filterOptions,
      config,
      pageNum,
      countsPerPage,
      searchHash,
      advancedFilter,
    );

    return adSearchApi.adChanceSearch(payload)
      .then((res) => {
        const data = res.response_data;
        const hash = data.api_ifno && data.api_ifno.redis_search_key;
        const params = {
          videos,
          filters: filterOptions,
          config,
          page: pageNum,
          hash,
        };
        const action = receiveAdChances(
          data.search_results,
          data.video_count,
          data.ad_count,
          params,
        );
        dispatch(action);
      })
      .catch((ex) => {
        LogUtil.log(ex);
        LogUtil.debug(`Query ad chances failed, statusText = ${ex}`);
        dispatch({
          type: types.RECEIVE_AD_CHANCES_FAIL,
          message: ex.message,
        });
        throw ex;
      });
  });

export function getFilterList(locale = API_LOCALE.ZH_TW) {
  return dispatch => filtersApi.requestAllFilters(locale)
      .then((res) => {
        const data = res.response_data;
        const customFilters = convertToFilterModel(data.custom_filters);
        const sharedFilters = sharedFilterToModel(
          data.shared_filters,
          convertToFilterModel,
          Filter);
        dispatch({
          type: types.RECEIVE_FILTER_LIST,
          sharedFilters,
          customFilters,
        });
      })
      .catch((ex) => {
        LogUtil.debug(`Get filter list failed, statusText = ${ex.statusText}`);
        dispatch({
          type: types.REQ_FAIL,
          message: 'Get filter list failed.',
        });
      });
}

export function createFilter(filterObj) {
  const jsonStr = JSON.stringify(filterObj.getContentJSON());

  const name = filterObj.name();

  return dispatch => filtersApi.createFilter(name, jsonStr)
      .then((res) => {
        const data = res.response_data;
        dispatch({
          type: types.CREATE_FILTER_SUCCESS,
          filter: convertToFilterModel(data),
        });
      })
      .catch((ex) => {
        dispatch({
          type: types.CREATE_FILTER_FAIL,
          message: 'Create filter failed.',
        });
        throw ex;
      });
}

export function removeFilter(id) {
  return dispatch => filtersApi.deleteFilter(id)
      .then(() => {
        dispatch({
          type: types.DELETE_FILTER_SUCCESS,
          id,
        });
      })
      .catch((ex) => {
        LogUtil.debug(`Remove filter failed, id = ${id}, statusText : ${(ex.response && ex.response.message) || ex}`);
        dispatch({
          type: types.DELETE_FILTER_FAIL,
          message: 'Remove filter failed. ',
        });
        throw ex;
      });
}

export const updateFilter = (id, filterObj) => ((dispatch) => {
  const jsonStr = JSON.stringify(filterObj.getContentJSON());

  const name = filterObj.name();

  return filtersApi.updateFilter(id, name, jsonStr)
    .then((res) => {
      const data = res.response_data;
      dispatch({
        type: types.UPDATE_FILTER_SUCCESS,
        id,
        filter: convertToFilterModel(data),
      });
    })
    .catch((ex) => {
      LogUtil.debug(`Update filter failed, id = ${id}, statusText : ${ex.statusText}`);
      throw ex;
    });
});

export function getSeries(isOnline = true, modeling = true, advancedFilter = {}) {
  return dispatch => seriesApi.getAllSeries(isOnline, advancedFilter)
      .then((res) => {
        const list = modeling ? convertToSeriesModel(res.series_lst) : res.series_lst;
        dispatch({
          type: types.RECEIVE_SERIES,
          series: list,
        });
      })
      .catch((ex) => {
        LogUtil.debug(`Get series failed, statusText : ${ex.statusText}`);
        dispatch({
          type: types.REQ_SERIES_FAIL,
          message: 'Get series failed',
        });
      });
}

export function requestAdForms() {
  return dispatch => adsApi.getForms()
      .then((res) => {
        const list = res.response_data.map(form => new AdForm(form));
        dispatch({
          type: types.RECEIVE_AD_FORMS,
          adForms: list,
        });
      })
      .catch((ex) => {
        LogUtil.debug(`Get ad forms failed, statusText : ${ex}`);
        dispatch({
          type: types.REQ_FAIL,
          message: 'Get ad forms failed',
        });
      });
}

export function requestAdCategories(locale = API_LOCALE.EN_US) {
  return dispatch => adsApi.getCategories(locale)
    .then((res) => {
      const data = res.response_data;
      const customList = convertToCategoryModel(data.custom_filters);
      const sharedList = sharedFilterToModel(
        data.shared_filters, convertToCategoryModel, AdCategory);

      dispatch({
        type: types.RECEIVE_AD_CATEGORIES,
        shared: sharedList,
        custom: customList,
      });
    })
    .catch((ex) => {
      LogUtil.debug(`Get ad categories failed, statusText : ${ex}`);
      dispatch({
        type: types.REQ_FAIL,
        message: 'Get ad categories failed',
      });
    });
}

export const requestScreenRatios = () => (dispatch => adsApi.getRatios()
    .then(res =>
      dispatch({
        type: types.RECEIVE_RATIO_LIST,
        ratios: res.screen_ratios,
      })
    )
    .catch((ex) => {
      LogUtil.debug(`Request screen ratios failed : ${ex}`);
    }));

export const clearAdSettingSearch = () => (
  {
    type: types.CLEAR_AD_SETTING_SEARCH,
  }
);

export const queryAllVideos = (isBrief, isOnline, advancedFilter) =>
  (dispatch => videosApi.getAllVideos(isBrief, isOnline, advancedFilter)
    .then(res => res.response_data)
    .then((list) => {
      const result = {};
      list.forEach((video) => {
        const seriesId = video.series_id;
        if (!(seriesId in result)) {
          result[seriesId] = [];
        }
        result[seriesId].push(video);
      });

      dispatch({
        type: types.RECEIVE_ALL_VIDEOS,
        payload: result,
      });
    }));

export const queryAllCampaignBriefs = () =>
  (dispatch => campaignApi.getAllCampaignBrief()
    .then((res) => {
      dispatch({
        type: types.RECEIVE_ALL_CAMPAIGN_BRIEF,
        briefs: res.response_data,
      });
    })
    .catch((ex) => {
      LogUtil.log(`action "queryAllcampaigns" occurs error, ex=${ex}`);
      throw ex;
    })
  );

export const requestAds = (campaignId, videosIds, subcategoryIds, filterIds, display,
                           offset, limit, startTime, endTime) =>
  (dispatch =>
      adsApi.getAdsV2(campaignId, videosIds, subcategoryIds, filterIds, display, offset,
        limit, startTime, endTime)
      .then((res) => {
        const data = res.response_data;
        dispatch(
          {
            type: types.RECEIVE_ADS,
            ads: data.ads,
            totalAdVideos: data.total_video_count,
            totalAdCount: data.total_ads_count,
            config: {
              videosIds,
              subcategoryIds,
              filterIds,
              display,
              offset,
              limit,
              startTime,
              endTime,
            },
            page: offsetToPageNum(offset, limit),
          }
        );
      })
      .catch((ex) => {
        LogUtil.debug(`Request ads failed, ex = ${ex}`);
        dispatch({
          type: types.REQ_FAIL,
          message: 'Get ad categories failed',
        });
        throw ex;
      })
);

export const clearAdPodSearch = () => (
  {
    type: types.CLEAR_AD_POD_SEARCH,
  }
);

export const showAlert = message => (
  {
    type: types.SHOW_ALERT,
    payload: message,
  }
);

export const dismissAlert = () => (
  {
    type: types.DISMISS_ALERT,
  }
);

export const deleteAds = (campaignId, adIdArray, videoIds, filterIDs, startTime, endTime,
  all) => dispatch => (
    adsApi.deleteAds(campaignId, adIdArray, videoIds, filterIDs, startTime, endTime, all)
      .then(res => dispatch(deleteAdsSuccess(res.response_data.ads, all)))
  );

export const deleteAdsSuccess = (ads, isAll) => (
  {
    type: types.DELETE_ADS_SUCCESS,
    ads,
    all: isAll,
  }
);

export const deleteAd = (videoId, adId) => dispatch => (
  adsApi.deleteAd(adId)
    .then(() => {
      dispatch({
        type: types.DELETE_AD,
        videoId,
        adId,
      });
    })
    .catch((ex) => {
      LogUtil.log(`API request delete ad:${adId} failed, ex=${ex}`);
    })
);

export const updateAd = (adId, adStr) => dispatch => (
  adsApi.updateAd(adId, adStr)
    .then((res) => {
      dispatch(
        {
          type: types.UPDATE_AD,
          ads: res.response_data.ads,
        }
      );
    })
    .catch((ex) => {
      LogUtil.log(`action "updateAd" occurs error, ${ex}`);
      LogUtil.log(ex);
    })
);

export const updateAds = (
  campaignId, adsContentStr, all, videoIDs, filterIDs, startTime, endTime, content) => dispatch => (
    adsApi.updateAds(
      campaignId, adsContentStr, all, videoIDs, filterIDs, startTime, endTime, content)
      .then((res) => {
        dispatch(
          {
            type: types.UPDATE_ADS,
            payload: res.response_data.ads,
          }
        );
      })
      .catch((ex) => {
        LogUtil.log(`action "updateAds" occurs error, ex=${ex}`);
        throw ex;
      })
);


function convertToSeriesModel(response) {
  if (Array.isArray(response)) {
    if (response.length === 0) { return []; }
    return response.map(item => new Series(item));
  }
  if (typeof response === 'object') { return new Series(response); }

  return response;
}

function convertToFilterModel(response) {
  if (Array.isArray(response)) {
    if (response.length === 0) { return []; }
    return response.map(item => new Filter(item));
  }
  if (typeof response === 'object') { return new Filter(response); }

  return response;
}

const sharedFilterToModel = (dictionary, converterFunc, Model) => {
  const result = [];
  Object.keys(dictionary).forEach((key) => {
    const item = dictionary[key];
    const parent = new Model();
    parent.name(key);
    parent.id(key);
    parent.isShared(true);
    parent.children(converterFunc(item));
    result.push(parent);
  });
  return result;
};

const convertToCategoryModel = (response) => {
  if (Array.isArray(response)) {
    if (response.length === 0) { return []; }
    return response.map(item => new AdCategory(item));
  }
  if (typeof response === 'object') { return new AdCategory(response); }

  return response;
};

export const setMessageCreator = (message, messageSuccess) => ({
  type: types.SET_MESSAGE,
  message,
  messageSuccess,
});

export const setMessage = (message, messageSuccess = true) => (dispatch) => {
  dispatch(setMessageCreator(null, messageSuccess));
  dispatch(setMessageCreator(message, messageSuccess));
};

const receiveCampaigns = campaignPageResp => ({
  type: types.RECEIVE_CAMPAIGNS,
  campaigns: campaignPageResp.campaigns,
  totalPageCount: campaignPageResp.totalPageCount,
  totalCampaignCount: campaignPageResp.totalCampaignCount,
});

export const requestCampaignsCreator = (targetPage, pageCount, searchText) =>
  dispatch =>
    Promise.resolve(campaignApi.getCampaigns(targetPage, pageCount, searchText))
      .then((response) => {
        const campaignPageResp = {
          campaigns: response.response_data.campaigns,
          totalPageCount: response.response_data.number_of_total_pages,
          totalCampaignCount: response.response_data.number_of_total_campaigns,
        };

        dispatch(receiveCampaigns(campaignPageResp));
      });

const receiveIsCampaignExist = isCampaignExist => ({
  type: types.RECEIVE_IS_CAMPAIGN_EXIST,
  isCampaignExist,
});

export const requestIsCampaignExistCreator = () =>
  dispatch =>
    Promise.resolve(campaignApi.getCampaigns(1, 1, ''))
      .then(response =>
        dispatch(receiveIsCampaignExist(response.response_data.campaigns.length > 0))
      );

export const checkCampaignName = name => (
  campaignApi.checkCampaignName(name)
    .then(res => res.response_data)
    .then(rdata => rdata.campaigns)
    .catch((err) => {
      LogUtil.log(`check campagin name error, error=${err}`);
      throw err;
    })
);

export const getAdHostsList = name => dispatch => (
  campaignApi.getAdHost(name)
    .then(r => r.response_data)
    .then((data) => {
      dispatch({
        type: types.RECEIVE_ADHOSTS_LIST,
        list: data,
      });
    })
    .catch((err) => {
      LogUtil.log(`get ad_hosts error, error=${err}`);
      throw err;
    })
);


export const addCampaign = data => (
  campaignApi.addCampaign(data)
    .then(r => r.response_data)
    .then(rData => rData.campaign_id)
    .catch((err) => {
      LogUtil.log(`add campaign error, error=${err}`);
      throw err;
    })
);

export const patchCampaign = (campaignId, data) => (
  campaignApi.patchCampaign(campaignId, data)
    .then(r => r.response_data)
    .catch((err) => {
      LogUtil.log(`patch campaign error, error=${err}`);
      throw err;
    })
);

export const duplicateCampaign = campaignId => (
  campaignApi.duplicateCampaign(campaignId)
    .then(r => r.response_data)
    .catch((err) => {
      LogUtil.log(`duplicate campaign error, error=${err}`);
      throw err.json;
    })
);

export const deleteCampaign = campaignId => (
  campaignApi.deleteCampaign(campaignId)
    .then(r => r.response_data)
    .catch((err) => {
      LogUtil.log(`delete campaign error, error=${err}`);
      throw err.json;
    })
);

const receiveGenreOptions = genreOptions => ({
  type: types.RECEIVE_GENRE_OPTIONS,
  payload: genreOptions,
});

const receivePlayViewOptions = playViewsOptions => ({
  type: types.RECEIVE_PLAY_VIEWS_OPTIONS,
  payload: playViewsOptions,
});

const receiveVideoYearOptions = videoYearOptions => ({
  type: types.RECEIVE_VIDEO_YEAR_OPTIONS,
  payload: videoYearOptions,
});

const receiveRunningTimeOptions = runningTimeOptions => ({
  type: types.RECEIVE_RUNNING_TIME_OPTIONS,
  payload: runningTimeOptions,
});

// const receiveHrsOptions = hrsOptions => ({
//   type: types.RECEIVE_HRS_OPTIONS,
//   payload: hrsOptions,
// });

const advancedOptionsReceiveMapping = {
  genre: receiveGenreOptions,
  play_views: receivePlayViewOptions,
  video_year: receiveVideoYearOptions,
  running_time: receiveRunningTimeOptions,
};

const mapObjectDataToFunc = mapping => (value, key) =>
  mapping[key](value);

const mapAdvancedOptionPayload = R.compose(
  R.values,
  R.mapObjIndexed(mapObjectDataToFunc(advancedOptionsReceiveMapping)),
  R.map(value => (
    R.map(key => ({
      id: key,
      text: value[key],
    }))(R.keys(value))
  )),
);

export const getAdvancedOptions = lang =>
  dispatch =>
    advancedApi.getAdvancedOptionsApi(lang)
      .then(r => r.response_data)
      .then(payload => (
        mapAdvancedOptionPayload(payload)
      ))
      .then(actions => actions.map(action => dispatch(action)));

const receiveGenreValues = genreValues => ({
  type: types.RECEIVE_GENRE_VALUES,
  payload: genreValues,
});

const receivePlayViewValues = playViewsValues => ({
  type: types.RECEIVE_PLAY_VIEWS_VALUES,
  payload: playViewsValues,
});

const receiveVideoYearValues = videoYearValues => ({
  type: types.RECEIVE_VIDEO_YEAR_VALUES,
  payload: videoYearValues,
});

const receiveRunningTimeValues = runningTimeValues => ({
  type: types.RECEIVE_RUNNING_TIME_VALUES,
  payload: runningTimeValues,
});

const receiveHrsValues = hrsValues => ({
  type: types.RECEIVE_HRS_VALUES,
  payload: hrsValues,
});

export const advancedValuesReceiveMapping = {
  genre: receiveGenreValues,
  playViews: receivePlayViewValues,
  videoYear: receiveVideoYearValues,
  runningTime: receiveRunningTimeValues,
  hrs: receiveHrsValues,
};
