/**
* Created Date : 2016/9/21
* Copyright (c) Viscovery.co
* Author : Amdis Liu <amdis.liu@viscovery.co>
* Contributor :
* Description : Pure functions to compute next state of app based on current state and given action
*/
import $ from 'jquery';

import * as types from '../actions/types';

const initialState = {
  searchObj: {
    1: {
      searchText: '',
    },
    6: {
      searchText: '',
    },
    7: {
      searchText: '',
    },
    8: {
      searchText: '',
    },
    9: {
      searchText: '',
    },
  },
  showImporting: false,
  duplicateBrands: [],
  isCsvUploadIllegal: false,
};

const modelTabsReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SUBMIT_SEARCH_TEXT: {
      const newSearchObj = $.extend(true, {}, state.searchObj);
      newSearchObj[action.searchTab].searchText = action.searchText;

      return {
        ...state,
        searchObj: newSearchObj,
      };
    }
    case types.SHOW_IMPORTING:
      return {
        ...state,
        showImporting: true,
      };
    case types.HIDE_IMPORTING:
      return {
        ...state,
        showImporting: false,
      };
    case types.UPLOAD_CSV_FAILED: {
      if (action.uploadErrorResp.json && action.uploadErrorResp.json.duplicate_brands) {
        const duplicateBrands = action.uploadErrorResp.json.duplicate_brands;

        return {
          ...state,
          duplicateBrands,
        };
      }

      return {
        ...state,
        isCsvUploadIllegal: true,
      };
    }
    case types.CLEAR_CSV_UPLOAD_ILLEGAL:
      return {
        ...state,
        isCsvUploadIllegal: false,
      };
    case types.CLEAR_DUP_BRANDS:
      return {
        ...state,
        duplicateBrands: [],
      };
    default:
      return state;
  }
};

export default modelTabsReducer;
