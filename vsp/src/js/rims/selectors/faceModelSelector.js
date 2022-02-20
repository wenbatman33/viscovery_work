import { NAME } from '../constants';

export const getModelsData = state => state[NAME].faceModelReducer.modelsData;
export const getClassesData = state => state[NAME].faceModelReducer.classesData;
export const getBrandsData = state => state[NAME].faceModelReducer.brandsData;
export const getIsUploadCsvSuccess = state => state[NAME].faceModelReducer.showCsvSuccessBar;
export const showAddBrandModal = state => state[NAME].faceModelReducer.showAddBrandModal;
export const getAddBrandFailedList = state => state[NAME].faceModelReducer.addBrandFailedList;
export const getIsSomeBrandsSuccess = state => state[NAME].faceModelReducer.isSomeBrandsSuccess;
export const getSuccessStyleBrand = state => state[NAME].faceModelReducer.successStyleBrand;
export const getEditBrandFailedList = state => state[NAME].faceModelReducer.editBrandFailedList;
