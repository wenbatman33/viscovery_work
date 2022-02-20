/**
* Created Date : 2016/9/21
* Copyright (c) Viscovery.co
* Author : Amdis Liu <amdis.liu@viscovery.co>
* Contributor :
* Description : Pure functions to compute next state of app based on current state and given action
*/
import * as types from '../actions/types';

const initialState = {
  modelsData: {
    1: {
      id: 1,
      name: 'face',
      name_zh_tw: '人臉',
      name_zh_cn: '人脸',
      classes: [1],
    },
  },
  classesData: {
    1: {
      id: 1,
      name: 'celebrityface',
      name_zh_tw: '名人人臉',
      name_zh_cn: '名人人脸',
      in_use: 1,
      create_time: '2017-02-18 13:15:11',
      brands: [1],
    },
  },
  brandsData: {
    1: {
      id: 1,
      vsp_id: 'F-1-1',
      model_id: 1,
      name: 'le-jia',
      name_zh_tw: '樂嘉',
      name_zh_cn: '乐嘉',
      in_use: 1,
      recognizable: null,
      memo: '',
      ipt_training: 0,
      ipt_testing: 0,
      vcms_id: 'None-None',
      create_time: '2017-02-18 13:15:11',
    },
  },
  recognizableCount: 0,
  showCsvSuccessBar: false,
  showAddBrandModal: false,
  addBrandFailedList: [],
  successStyleBrand: {
    id: '',
  },
  isSomeBrandsSuccess: false,
  editBrandFailedList: [],
};

const faceModelReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.CHANGE_PAGE:
      return {
        ...state,
        currentPage: action.targetPage,
      };
    case types.SHOW_SUCCESS_BAR:
      return {
        ...state,
        showCsvSuccessBar: true,
      };
    case types.HIDE_SUCCESS_BAR:
      return {
        ...state,
        showCsvSuccessBar: false,
      };
    case types.RECEIVE_MODEL_DATA: {
      const { models, classes, brands } = action.modelPageData.normalizedModelData.entities;
      return {
        ...state,
        modelsData: models,
        classesData: classes,
        brandsData: brands,
        recognizableCount: action.modelPageData.recognizableCount,
      };
    }
    case types.OPEN_ADD_BRAND:
      return {
        ...state,
        showAddBrandModal: true,
      };
    case types.CANCEL_ADD_BRAND:
      return {
        ...state,
        showAddBrandModal: false,
      };
    case types.ADD_BRAND_FAILED:
      return {
        ...state,
        addBrandFailedList: action.addBrandErrorResp.json.duplicate_brands,
      };
    case types.CLEAR_ADD_FAILED_BRAND:
      return {
        ...state,
        addBrandFailedList: [],
      };
    case types.SHOW_BRAND_SUCCESS_STYLE:
      return {
        ...state,
        isSomeBrandsSuccess: true,
        successStyleBrand: action.successStyleBrand,
      };
    case types.HIDE_BRAND_SUCCESS_STYLE:
      return {
        ...state,
        isSomeBrandsSuccess: false,
        successStyleBrand: {
          id: '',
        },
      };
    case types.EDIT_BRAND_FAILED:
      return {
        ...state,
        editBrandFailedList: action.editBrandErrorResp.json.duplicate_brands,
      };
    case types.CLEAR_EDIT_BRAND_FAILED_LIST:
      return {
        ...state,
        editBrandFailedList: [],
      };
    default:
      return state;
  }
};

export default faceModelReducer;
