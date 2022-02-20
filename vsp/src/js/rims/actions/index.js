import { showLoading, hideLoading } from 'vidya/LoadingBar';

import * as types from './types';
import { requestModelDataApi, uploadCsvApi, createNewBrandApi, editBrandApi } from '../apis/tagsApi';

export const changePageCreator = targetPage => ({
  type: types.CHANGE_PAGE,
  targetPage,
});

export const submitSearchTextCreator = searchObj => ({
  type: types.SUBMIT_SEARCH_TEXT,
  searchText: searchObj.searchText,
  searchTab: searchObj.searchTab,
});

const receiveModelDataCreator = modelPageData => ({
  type: types.RECEIVE_MODEL_DATA,
  modelPageData,
});

export const requestModelDataCreator = (classInUse = 'all', brandInUse = 'all') =>
  (dispatch) => {
    dispatch(showLoading());
    return Promise.resolve(requestModelDataApi(classInUse, brandInUse))
      .then(modelPageData => dispatch(receiveModelDataCreator(modelPageData)))
      .then(() => dispatch(hideLoading()));
  };

const showImporting = () => ({
  type: types.SHOW_IMPORTING,
});

const hideImporting = () => ({
  type: types.HIDE_IMPORTING,
});

const showCsvSuccessBar = () => ({
  type: types.SHOW_SUCCESS_BAR,
});

const hideCsvSuccessBar = () => ({
  type: types.HIDE_SUCCESS_BAR,
});

const uploadCsvFailedCreator = uploadErrorResp => ({
  type: types.UPLOAD_CSV_FAILED,
  uploadErrorResp,
});

export const clearCsvUploadIllegalCreator = () => ({
  type: types.CLEAR_CSV_UPLOAD_ILLEGAL,
});

const showBrandSuccessStyle = successBrand => ({
  type: types.SHOW_BRAND_SUCCESS_STYLE,
  successStyleBrand: successBrand,
});

const hideBrandSuccessStyle = () => ({
  type: types.HIDE_BRAND_SUCCESS_STYLE,
});

export const uploadCsvCreator = (fileObj) => {
  const data = new FormData();
  data.append('file', fileObj);

  return (dispatch) => {
    dispatch(showImporting());
    return Promise.resolve(uploadCsvApi(data))
      .then((uploadSuccessBrands) => {
        dispatch(requestModelDataCreator('all', 'all'));
        return uploadSuccessBrands;
      })
      .then((uploadSuccessBrands) => {
        dispatch(hideImporting());
        dispatch(showCsvSuccessBar());
        dispatch(showBrandSuccessStyle(uploadSuccessBrands));
      })
      .then(() => setTimeout(() => dispatch(hideBrandSuccessStyle()), 5000))
      .then(() => setTimeout(() => dispatch(hideCsvSuccessBar()), 2000))
      .catch((uploadErrorResp) => {
        dispatch(hideImporting());
        dispatch(uploadCsvFailedCreator(uploadErrorResp));
      });
  };
};

export const clearDupBrandsCreator = () => ({
  type: types.CLEAR_DUP_BRANDS,
});

export const openAddBrandCreator = () => ({
  type: types.OPEN_ADD_BRAND,
});

export const cancelAddBrandModalCreator = () => ({
  type: types.CANCEL_ADD_BRAND,
});

const addBrandFailedCreator = addBrandErrorResp => ({
  type: types.ADD_BRAND_FAILED,
  addBrandErrorResp,
});

export const clearAddFailedBrandCreator = () => ({
  type: types.CLEAR_ADD_FAILED_BRAND,
});

export const submitAddBrandCreator = (brandSubmitData, callBack) =>
  (dispatch) => {
    const data = new FormData();
    Object.keys(brandSubmitData).forEach((submitProperty) => {
      data.append(submitProperty, brandSubmitData[submitProperty]);
    });

    return Promise.resolve(createNewBrandApi(data))
      .then((addSuccessBrand) => {
        dispatch(requestModelDataCreator('all', 'all'));
        return addSuccessBrand;
      })
      .then((addSuccessBrand) => {
        callBack();
        dispatch(showBrandSuccessStyle(addSuccessBrand));
      })
      .then(() => dispatch(showCsvSuccessBar()))
      .then(() => setTimeout(() => dispatch(hideBrandSuccessStyle()), 5000))
      .then(() => setTimeout(() => dispatch(hideCsvSuccessBar()), 2000))
      .catch((addBrandErrorResp) => {
        dispatch(addBrandFailedCreator(addBrandErrorResp));
      });
  };

const editBrandFailedCreator = editBrandErrorResp => ({
  type: types.EDIT_BRAND_FAILED,
  editBrandErrorResp,
});

export const submitEditBrandCreator = (editedBrand, callBack) =>
  (dispatch) => {
    const data = new FormData();
    Object.keys(editedBrand).forEach((editedProperty) => {
      data.append(editedProperty, editedBrand[editedProperty]);
    });

    return Promise.resolve(editBrandApi(data))
      .then((updatedBrand) => {
        dispatch(requestModelDataCreator('all', 'all'));
        return updatedBrand;
      })
      .then((updatedBrand) => {
        callBack();
        dispatch(showBrandSuccessStyle(updatedBrand));
      })
      .then(() => setTimeout(() => dispatch(hideBrandSuccessStyle()), 5000))
      .catch((editBrandErrorResp) => {
        dispatch(editBrandFailedCreator(editBrandErrorResp));
      });
  };

export const clearEditBrandFailedListCreator = () => ({
  type: types.CLEAR_EDIT_BRAND_FAILED_LIST,
});
