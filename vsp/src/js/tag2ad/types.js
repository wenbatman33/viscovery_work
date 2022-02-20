/**
* Created Date : 2016/9/21
* Copyright (c) Viscovery.co
* Author : Amdis Liu <amdis.liu@viscovery.co>
* Contributor :
* Description : action type constants for actions.js
*/
import { NAME } from './constants';

const prefix = NAME.concat('/');

// module messages
export const SHOW_ALERT = prefix.concat('SHOW_ALERT');
export const DISMISS_ALERT = prefix.concat('DISMISS_ALERT');
export const SET_MESSAGE = prefix.concat('SET_MESSAGE');
export const REQ_FAIL = prefix.concat('REQ_FAIL');


// filter operations
export const RECEIVE_FILTER_LIST = prefix.concat('RECEIVE_FILTER_LIST');

export const CREATE_FILTER_SUCCESS = prefix.concat('CREATE_FILTER_SUCCESS');
export const CREATE_FILTER_FAIL = prefix.concat('CREATE_FILTER_FAIL');

export const DELETE_FILTER_SUCCESS = prefix.concat('DELETE_FILTER_SUCCESS');
export const DELETE_FILTER_FAIL = prefix.concat('DELETE_FILTER_FAIL');

export const UPDATE_FILTER_SUCCESS = prefix.concat('UPDATE_FILTER_SUCCESS');

// ad chances
export const RECEIVE_AD_CHANCES = prefix.concat('RECEIVE_AD_CHANCES');
export const RECEIVE_AD_CHANCES_FAIL = prefix.concat('RECEIVE_AD_CHANCES_FAIL');
export const CLEAR_AD_SETTING_SEARCH = prefix.concat('CLEAR_AD_SETTING_SEARCH');

// ad pods
export const RECEIVE_ADS = prefix.concat('RECEIVE_ADS');
export const CLEAR_AD_POD_SEARCH = prefix.concat('CLEAR_AD_POD_SEARCH');

export const DELETE_ADS_SUCCESS = prefix.concat('DELETE_ADS_SUCCESS');
export const DELETE_AD = prefix.concat('DELETE_AD');

export const UPDATE_AD = prefix.concat('UPDATE_AD');
export const UPDATE_ADS = prefix.concat('UPDATE_ADS');

export const RECEIVE_ALL_CAMPAIGN_BRIEF = prefix.concat('RECEIVE_ALL_CAMPAIGN_BRIEF');

// series && videos
export const RECEIVE_SERIES = prefix.concat('RECEIVE_SERIES');
export const REQ_SERIES_FAIL = prefix.concat('REQ_SERIES_FAIL');

export const RECEIVE_SERIRES_VIDEO_LIST = prefix.concat('RECEIVE_SERIRES_VIDEO_LIST');
export const RECEIVE_ALL_VIDEOS = prefix.concat('RECEIVE_ALL_VIDEOS');


// general data
export const RECEIVE_TAGS = prefix.concat('GET_TAGS');
export const RECEIVE_BRAND_LIST = prefix.concat('RECEIVE_BRAND_LIST');

export const RECEIVE_AD_FORMS = prefix.concat('RECEIVE_AD_FORMS');
export const RECEIVE_AD_CATEGORIES = prefix.concat('RECEIVE_AD_CATEGORIES');

export const RECEIVE_RATIO_LIST = prefix.concat('RECEIVE_RATIO_LIST');

export const RECEIVE_CAMPAIGNS = prefix.concat('RECEIVE_CAMPAIGNS');
export const RECEIVE_IS_CAMPAIGN_EXIST = prefix.concat('RECEIVE_IS_CAMPAIGN_EXIST');

export const RECEIVE_ADHOSTS_LIST = prefix.concat('RECEIVE_ADHOSTS_LIST');

export const RECEIVE_HRS_OPTIONS = prefix.concat('RECEIVE_HRS_OPTIONS');
export const RECEIVE_GENRE_OPTIONS = prefix.concat('RECEIVE_GENRE_OPTIONS');
export const RECEIVE_PLAY_VIEWS_OPTIONS = prefix.concat('RECEIVE_PLAY_VIEWS_OPTIONS');
export const RECEIVE_VIDEO_YEAR_OPTIONS = prefix.concat('RECEIVE_VIDEO_YEAR_OPTIONS');
export const RECEIVE_RUNNING_TIME_OPTIONS = prefix.concat('RECEIVE_RUNNING_TIME_OPTIONS');

export const RECEIVE_HRS_VALUES = prefix.concat('RECEIVE_HRS_VALUES');
export const RECEIVE_GENRE_VALUES = prefix.concat('RECEIVE_GENRE_VALUES');
export const RECEIVE_PLAY_VIEWS_VALUES = prefix.concat('RECEIVE_PLAY_VIEWS_VALUES');
export const RECEIVE_VIDEO_YEAR_VALUES = prefix.concat('RECEIVE_VIDEO_YEAR_VALUES');
export const RECEIVE_RUNNING_TIME_VALUES = prefix.concat('RECEIVE_RUNNING_TIME_VALUES');
