/**
 * Created by amdis on 2016/10/5.
 */
import { NAME } from './constants';
import { currentRoleInfo } from '../auth/selectors';

export { getUser } from '../auth/selectors';

export { getLocale } from '../app/selectors';

export const getSeries = state => state[NAME].series;
export const getAdForms = state => state[NAME].adForms;
export const getAdCategories = state => [
  ...state[NAME].sharedCategories, ...state[NAME].customCategories];
export const getScreenRatios = state => state[NAME].ratios;
export const getTags = state => state[NAME].tags;
export const getTagBrands = state => state[NAME].tag_brands;
export const getSharedFilters = state => state[NAME].sharedFilters;
export const getCustomFilters = state => state[NAME].customFilters;
export const getVideos = state => state[NAME].videos;
export const getSharedCategories = state => state[NAME].sharedCategories;
export const getCustomCategories = state => state[NAME].customCategories;
export const getAllCampaignBriefs = state => state[NAME].allCampaignBriefs;

export const getAds = state => state[NAME].ads;
export const getAdVideoCount = state => state[NAME].totalAdVideos;
export const getAdCount = state => state[NAME].totalAdCount;
export const getAdSearchConfig = state => state[NAME].adSearchConfig;
export const adsSearchEmpty = state => state[NAME].adsSearchEmpty;
export const getAdsActivePage = state => state[NAME].adsActivePage;

export const showAlert = state => state[NAME].showAlert;
export const getAlertMessage = state => state[NAME].alertMessage;
export const getAdChances = state => state[NAME].adChances;
export const chanceVideoCount = state => state[NAME].totalChanceVideos;
export const chanceCount = state => state[NAME].totalChanceCount;
export const getLastChanceSearchParams = state => state[NAME].lastChanceSearchParam;
export const isChanceSearchEmpty = state => state[NAME].chanceSearchEmpty;

export const getMessage = state => state[NAME].message;
export const getMessageSuccess = state => state[NAME].messageSuccess;

export const getCampaigns = state => state[NAME].campaigns;
export const isCampaignExist = state => state[NAME].isCampaignExist;
export const getPageCount = state => state[NAME].totalPageCount;
export const getCampaignCount = state => state[NAME].totalCampaignCount;

export const getCampaignNameInvalid = state => state[NAME].campaignNameInvalid;
export const getAdHosts = state => state[NAME].adHostsList;

export const disableExportAds = (state) => {
  if (currentRoleInfo(state)) {
    return currentRoleInfo(state).ad_business_model_id === '2';
  }
  return true;
};
export const getGenreOptions = state => state[NAME].genreOptions;
export const getPlayViewsOptions = state => state[NAME].playViewsOptions;
export const getVideoYearOptions = state => state[NAME].videoYearOptions;
export const getRunningTimeOptions = state => state[NAME].runningTimeOptions;
export const getHrsOptions = state => state[NAME].hrsOptions;

export const getFilterValues = state => state[NAME].filterValues;
export const getGenreValues = state => state[NAME].filterValues.genre;
export const getPlayViewsValues = state => state[NAME].filterValues.playViews;
export const getVideoYearValues = state => state[NAME].filterValues.videoYear;
export const getRunningTimeValues = state => state[NAME].filterValues.runningTime;
export const getHrsValues = state => state[NAME].filterValues.hrs;
