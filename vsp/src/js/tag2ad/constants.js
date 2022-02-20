/**
* Created Date : 2016/9/22
* Copyright (c) Viscovery.co
* Author : Amdis Liu <amdis.liu@viscovery.co>
* Contributor :
* Description :
*/

export const NAME = 'tag2ad';
export const AD_POD_TIME_OPTIONS = {
  ALL: 'all',
  WITHIN_1_WEEK: '1w',
  WITHIN_2_WEEKS: '2w',
  WITHIN_1_MONTH: '1m',
};
export const API_LOCALE = {
  ZH_TW: 'zhtw',
  ZH_CN: 'zhcn',
  EN_US: 'enus',
};
export const AD_SEARCH_LIMIT = 50;
export const AD_POD_LIMIT = 50; // num of videos in one page
export const AD_CHANCE_SPACE_UNIT = {
  PERCENTAGE: 'percentage',
  TIME: 'time',
};

export const START_DURATION_PERCENTGE = 0;
export const END_DURATION_PERCENTAGE = 100;

export const CREATE_AD_DEFAULT_FORM_ID = 5;

export const PATH = {
  CAMPAIGN_LIST: `/${NAME}/campaignList`,
  CHANCE_SEARCH: `/${NAME}/adsearch`,
  AD_POD_SEARCH: `/${NAME}/admanagement`,
};
